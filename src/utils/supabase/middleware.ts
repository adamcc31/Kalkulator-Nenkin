import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // ============================================================
    // DASHBOARD ROUTES — Separate auth flow for admin
    // ============================================================
    const isDashboardRoute = pathname.startsWith('/dashboard')
    const isDashboardLogin = pathname === '/dashboard/login'

    if (isDashboardRoute) {
        if (isDashboardLogin) {
            // If already authenticated as admin, skip login page
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role === 'admin') {
                    const url = request.nextUrl.clone()
                    url.pathname = '/dashboard'
                    return NextResponse.redirect(url)
                }
            }
            // Not logged in or not admin → show dashboard login form
            return supabaseResponse
        }

        // All other /dashboard/* routes require authenticated admin
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard/login'
            return NextResponse.redirect(url)
        }

        // User is authenticated — verify admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            // Not admin → kick out to public home
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }

        // Admin verified → allow access (skip onboarding check)
        return supabaseResponse
    }

    // ============================================================
    // PUBLIC ROUTES — Existing logic (unchanged)
    // ============================================================
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth') || pathname.startsWith('/api/admin')
    const isOnboardingRoute = pathname.startsWith('/onboarding')

    if (!user && !isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user) {
        // Check onboarding status
        if (!isOnboardingRoute && !isAuthRoute) {
            const { data: profile } = await supabase.from('profiles').select('is_onboarded').eq('id', user.id).single()
            if (!profile?.is_onboarded) {
                const url = request.nextUrl.clone()
                url.pathname = '/onboarding'
                return NextResponse.redirect(url)
            }
        } else if (isAuthRoute && pathname === '/login') {
            const { data: profile } = await supabase.from('profiles').select('is_onboarded').eq('id', user.id).single()
            const url = request.nextUrl.clone()
            url.pathname = profile?.is_onboarded ? '/' : '/onboarding'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
