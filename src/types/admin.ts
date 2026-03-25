// Admin dashboard type definitions

export interface DashboardStats {
    totalUsers: number
    thisMonthRegistrations: number
    notOnboarded: number
    usersWithLpk: number
    nearestReturnDate: string | null
}

export interface MonthlyRegistration {
    month: string      // Format: YYYY-MM
    count: number
}

export interface ReturnDateDistribution {
    month: string      // Format: YYYY-MM
    count: number
}

export interface LpkDistribution {
    lpk: string
    count: number
}

export interface AdminUser {
    id: string
    fullname: string | null
    email: string
    returnDate: string | null
    whatsapp: string | null
    lpk: string | null
    isOnboarded: boolean
    createdAt: string
    role: 'user' | 'admin'
}

export interface UserListParams {
    page: number
    pageSize: number
    search?: string
    filterOnboarded?: boolean | null
    filterLpk?: string
    filterReturnDateFrom?: string
    filterReturnDateTo?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface UserListResult {
    users: AdminUser[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}
