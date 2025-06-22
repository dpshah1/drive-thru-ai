// db.js
import postgres from 'postgres'

const connectionString = process.env.NEXT_PUBLIC_SUPABASE_URL
const sql = postgres(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default sql