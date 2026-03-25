import 'server-only'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Validates that the currently authenticated user has admin role.
 * Uses the regular Supabase client (anon key) to check the session,
 * then queries the profiles table for the role.
 *
 * @returns The authenticated admin user object
 * @throws Redirects to / if not admin, redirects to /dashboard/login if not authenticated
 */
export async function requireAdmin() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/dashboard/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    return user
}

/**
 * Checks admin role without redirecting. Returns boolean.
 * Useful for conditional rendering or API routes.
 */
export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}
