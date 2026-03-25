import 'server-only'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/lib/server/adminSupabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Verify admin role
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch all users with admin client
        const admin = createAdminClient()

        const { data: profiles } = await admin
            .from('profiles')
            .select('id, fullname, return_date, whatsapp, lpk, is_onboarded, created_at')
            .order('created_at', { ascending: false })

        // Get emails from auth
        const { data: authData } = await admin.auth.admin.listUsers({
            perPage: 1000,
        })

        const emailMap = new Map<string, string>()
        authData?.users?.forEach((u) => {
            emailMap.set(u.id, u.email || '')
        })

        // Build CSV
        const headers = [
            'No',
            'Nama Lengkap',
            'Email',
            'Estimasi Kepulangan',
            'No. WhatsApp',
            'LPK/SO',
            'Status Onboarding',
            'Tanggal Registrasi',
        ]

        const rows = (profiles || []).map((p, i) => [
            i + 1,
            escapeCsv(p.fullname || ''),
            escapeCsv(emailMap.get(p.id) || ''),
            escapeCsv(p.return_date || ''),
            escapeCsv(p.whatsapp || ''),
            escapeCsv(p.lpk || ''),
            p.is_onboarded ? 'Aktif' : 'Pending',
            new Date(p.created_at).toLocaleString('id-ID'),
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n')

        // Add BOM for Excel compatibility
        const bom = '\uFEFF'
        const csvWithBom = bom + csvContent

        return new NextResponse(csvWithBom, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

function escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}
