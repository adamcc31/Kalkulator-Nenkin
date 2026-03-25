/**
 * Seed Script: Create admin and user accounts for development
 *
 * USAGE:
 *   1. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 *   2. Run: node scripts/seed-admin.mjs
 *
 * This script:
 *   - Creates admin@exata.id with role 'admin'
 *   - Creates user@exata.id with role 'user'
 *   - Uses Supabase Admin API (service role key)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim()
    }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
})

const accounts = [
    {
        email: 'admin@exata.id',
        password: '9NUxjas8+@SCxas3',
        role: 'admin',
        fullname: 'Admin EXATA',
    },
    {
        email: 'user@exata.id',
        password: '@Semangatbaru2026',
        role: 'user',
        fullname: 'User Test',
    },
]

async function seed() {
    for (const account of accounts) {
        console.log(`\n📧 Creating ${account.email} (${account.role})...`)

        // Create user via Admin API
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
            email: account.email,
            password: account.password,
            email_confirm: true,
            user_metadata: { full_name: account.fullname },
        })

        if (createError) {
            if (createError.message.includes('already been registered')) {
                console.log(`   ⚠️  User ${account.email} already exists, updating role...`)

                // Find existing user
                const { data: listData } = await supabase.auth.admin.listUsers()
                const existingUser = listData?.users?.find((u) => u.email === account.email)

                if (existingUser) {
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({ role: account.role, fullname: account.fullname })
                        .eq('id', existingUser.id)

                    if (updateError) {
                        console.error(`   ❌ Failed to update role: ${updateError.message}`)
                    } else {
                        console.log(`   ✅ Role updated to '${account.role}'`)
                    }
                }
                continue
            }

            console.error(`   ❌ Create failed: ${createError.message}`)
            continue
        }

        // Update role in profiles
        if (authUser?.user) {
            // Wait a moment for the trigger to create the profile
            await new Promise((r) => setTimeout(r, 1000))

            const { error: roleError } = await supabase
                .from('profiles')
                .update({ role: account.role, fullname: account.fullname })
                .eq('id', authUser.user.id)

            if (roleError) {
                console.error(`   ❌ Failed to set role: ${roleError.message}`)
            } else {
                console.log(`   ✅ Created with role '${account.role}'`)
            }
        }
    }

    console.log('\n🎉 Seed complete!\n')
}

seed().catch(console.error)
