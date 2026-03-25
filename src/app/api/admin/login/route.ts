import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// In-memory rate limiter (acceptable for V1, resets on cold start)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now()
    const record = loginAttempts.get(ip)

    if (!record || now - record.firstAttempt > WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now })
        return { allowed: true }
    }

    if (record.count >= MAX_ATTEMPTS) {
        const retryAfter = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000)
        return { allowed: false, retryAfterSeconds: retryAfter }
    }

    record.count++
    return { allowed: true }
}

export async function POST(request: Request) {
    try {
        // Rate limiting by IP
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
        const rateCheck = checkRateLimit(ip)

        if (!rateCheck.allowed) {
            return NextResponse.json(
                {
                    error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
                },
                { status: 429 }
            )
        }

        // Parse body
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email dan password harus diisi.' },
                { status: 400 }
            )
        }

        // Create Supabase client with cookie handling for this request
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Cookie setting in route handler
                        }
                    },
                },
            }
        )

        // Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError || !authData.user) {
            return NextResponse.json(
                { error: 'Email atau password salah.' },
                { status: 401 }
            )
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single()

        if (profile?.role !== 'admin') {
            // Not admin → sign out and reject
            await supabase.auth.signOut()
            return NextResponse.json(
                { error: 'Akun ini tidak memiliki akses admin.' },
                { status: 403 }
            )
        }

        // Success — Supabase SSR already set the session cookies
        // Reset rate limit for this IP on success
        loginAttempts.delete(ip)

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
            { status: 500 }
        )
    }
}
