'use server'

import { createAdminClient } from '@/lib/server/adminSupabase'
import { requireAdmin } from '@/lib/server/adminAuth'
import type {
    DashboardStats,
    MonthlyRegistration,
    AdminUser,
    UserListParams,
    UserListResult,
    LpkDistribution,
} from '@/types/admin'

/**
 * Get dashboard KPI stats.
 * Requires admin role — throws redirect if not admin.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    await requireAdmin()
    const admin = createAdminClient()

    // Total users
    const { count: totalUsers } = await admin
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Registrations this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonthRegistrations } = await admin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())

    // Not onboarded
    const { count: notOnboarded } = await admin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_onboarded', false)

    // Users with LPK
    const { count: usersWithLpk } = await admin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('lpk', 'is', null)
        .neq('lpk', '')

    // Nearest return date
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const { data: nearestReturn } = await admin
        .from('profiles')
        .select('return_date')
        .gte('return_date', currentMonth)
        .order('return_date', { ascending: true })
        .limit(1)
        .single()

    return {
        totalUsers: totalUsers || 0,
        thisMonthRegistrations: thisMonthRegistrations || 0,
        notOnboarded: notOnboarded || 0,
        usersWithLpk: usersWithLpk || 0,
        nearestReturnDate: nearestReturn?.return_date || null,
    }
}

/**
 * Get monthly registration data for chart.
 */
export async function getMonthlyRegistrations(months: number = 12): Promise<MonthlyRegistration[]> {
    await requireAdmin()
    const admin = createAdminClient()

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const { data } = await admin
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

    // Group by month client-side
    const grouped = new Map<string, number>()

    // Initialize all months
    for (let i = 0; i < months; i++) {
        const d = new Date()
        d.setMonth(d.getMonth() - (months - 1 - i))
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        grouped.set(key, 0)
    }

    // Count registrations per month
    data?.forEach((row) => {
        const d = new Date(row.created_at)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (grouped.has(key)) {
            grouped.set(key, (grouped.get(key) || 0) + 1)
        }
    })

    return Array.from(grouped.entries()).map(([month, count]) => ({ month, count }))
}

/**
 * Get top LPK distribution for chart.
 */
export async function getLpkDistribution(limit: number = 10): Promise<LpkDistribution[]> {
    await requireAdmin()
    const admin = createAdminClient()

    const { data } = await admin
        .from('profiles')
        .select('lpk')
        .not('lpk', 'is', null)
        .neq('lpk', '')

    // Group and count client-side
    const grouped = new Map<string, number>()
    data?.forEach((row) => {
        const lpk = row.lpk || 'Lainnya'
        grouped.set(lpk, (grouped.get(lpk) || 0) + 1)
    })

    return Array.from(grouped.entries())
        .map(([lpk, count]) => ({ lpk, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
}

/**
 * Get paginated user list with search and filter.
 */
export async function getUsers(params: UserListParams): Promise<UserListResult> {
    await requireAdmin()
    const admin = createAdminClient()

    const {
        page = 1,
        pageSize = 25,
        search,
        filterOnboarded,
        filterLpk,
        filterReturnDateFrom,
        filterReturnDateTo,
        sortBy = 'created_at',
        sortOrder = 'desc',
    } = params

    // Build query
    let query = admin
        .from('profiles')
        .select('id, fullname, return_date, whatsapp, lpk, is_onboarded, created_at, role', {
            count: 'exact',
        })

    // Search filter (fullname or whatsapp)
    if (search) {
        query = query.or(`fullname.ilike.%${search}%,whatsapp.ilike.%${search}%`)
    }

    // Onboarded filter
    if (filterOnboarded !== null && filterOnboarded !== undefined) {
        query = query.eq('is_onboarded', filterOnboarded)
    }

    // LPK filter
    if (filterLpk) {
        query = query.eq('lpk', filterLpk)
    }

    // Return date range filter
    if (filterReturnDateFrom) {
        query = query.gte('return_date', filterReturnDateFrom)
    }
    if (filterReturnDateTo) {
        query = query.lte('return_date', filterReturnDateTo)
    }

    // Sort
    const ascending = sortOrder === 'asc'
    query = query.order(sortBy, { ascending })

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: profiles, count } = await query

    // Get emails from Supabase Auth Admin API
    const userIds = profiles?.map((p) => p.id) || []
    let emailMap = new Map<string, string>()

    if (userIds.length > 0) {
        const { data: authData } = await admin.auth.admin.listUsers({
            perPage: 1000,
        })

        if (authData?.users) {
            authData.users.forEach((u) => {
                emailMap.set(u.id, u.email || '')
            })
        }
    }

    const users: AdminUser[] = (profiles || []).map((p) => ({
        id: p.id,
        fullname: p.fullname,
        email: emailMap.get(p.id) || '',
        returnDate: p.return_date,
        whatsapp: p.whatsapp,
        lpk: p.lpk,
        isOnboarded: p.is_onboarded,
        createdAt: p.created_at,
        role: p.role || 'user',
    }))

    const total = count || 0
    return {
        users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

/**
 * Get all unique LPK values for filter dropdown.
 */
export async function getUniqueLpks(): Promise<string[]> {
    await requireAdmin()
    const admin = createAdminClient()

    const { data } = await admin
        .from('profiles')
        .select('lpk')
        .not('lpk', 'is', null)
        .neq('lpk', '')

    const unique = new Set<string>()
    data?.forEach((row) => {
        if (row.lpk) unique.add(row.lpk)
    })

    return Array.from(unique).sort()
}

/**
 * Get all users for CSV export (no pagination).
 */
export async function getAllUsersForExport(): Promise<AdminUser[]> {
    await requireAdmin()
    const admin = createAdminClient()

    const { data: profiles } = await admin
        .from('profiles')
        .select('id, fullname, return_date, whatsapp, lpk, is_onboarded, created_at, role')
        .order('created_at', { ascending: false })

    // Get all emails
    const { data: authData } = await admin.auth.admin.listUsers({
        perPage: 1000,
    })

    const emailMap = new Map<string, string>()
    authData?.users?.forEach((u) => {
        emailMap.set(u.id, u.email || '')
    })

    return (profiles || []).map((p) => ({
        id: p.id,
        fullname: p.fullname,
        email: emailMap.get(p.id) || '',
        returnDate: p.return_date,
        whatsapp: p.whatsapp,
        lpk: p.lpk,
        isOnboarded: p.is_onboarded,
        createdAt: p.created_at,
        role: p.role || 'user',
    }))
}
