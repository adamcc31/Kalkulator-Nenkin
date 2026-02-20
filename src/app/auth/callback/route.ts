import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // URL to redirect to after sign in process completes
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check onboarding status
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('is_onboarded').eq('id', user.id).single()
                if (!profile?.is_onboarded) {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page or login with error message
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
