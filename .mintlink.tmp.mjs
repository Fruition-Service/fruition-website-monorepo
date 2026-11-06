import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split('\n')
  .filter(l=>l.includes('=')&&!l.trim().startsWith('#'))
  .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}))
const admin = createClient(env.PORTAL_SUPABASE_URL, env.PORTAL_SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken:false, persistSession:false }})
const { data, error } = await admin.auth.admin.generateLink({ type:'magiclink', email:'edward@fruitionservices.io' })
if (error) { console.error('ERR', error.message); process.exit(1) }
console.log('https://www.fruitionservices.io/internal/auth/confirm?token_hash=' + data.properties.hashed_token + '&type=magiclink&next=%2Finternal%2Fsocial%2Fnew')
