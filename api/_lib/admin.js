import { createClient } from '@supabase/supabase-js'

const adminId = '8b4f5926-c6ec-43a0-aa34-7277a2732577'
const adminEmail = 'admin@soiraoyaconsulting.com.ng'

export async function getAdminClient(request, response) {
  const authorization = request.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey || !serviceKey) {
    response.status(500).json({ ok: false, message: 'Missing Supabase server configuration.' })
    return null
  }
  if (!token) {
    response.status(401).json({ ok: false, message: 'Admin authentication is required.' })
    return null
  }

  const authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: { user }, error } = await authClient.auth.getUser(token)
  if (error || user?.id !== adminId || user?.email?.toLowerCase() !== adminEmail) {
    response.status(403).json({ ok: false, message: 'Admin access is required.' })
    return null
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing Supabase server configuration.')
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
