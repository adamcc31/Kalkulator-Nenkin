import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with Service Role Key.
 * This client bypasses RLS entirely — use ONLY on the server.
 *
 * NEVER import this file from a Client Component.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. ' +
            'Ensure these are set in .env.local (service role key must NOT be NEXT_PUBLIC_*).'
        )
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
