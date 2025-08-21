import { createClient } from "@/lib/supabase/server"
import { NextApiResponse } from "next"
import { NextApiRequest } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" })

  const { email } = req.body
  if (!email) return res.status(400).json({ error: "Email is required" })

  const supabase = await createClient({ req, res })

  const { error } = await supabase.auth.signInWithOtp({
    email
  })

  if (error) {
    if (
      error.message &&
      (
        error.message.includes("paused") ||
        error.message.toLowerCase().includes("project is inactive") ||
        error.message.toLowerCase().includes("project is paused") ||
        error.message.toLowerCase().includes("connection refused")
      )
    ) {
      return res.status(503).json({
        error: "The authentication service is temporarily unavailable because the Supabase project is paused for inactivity. Please contact the developer so they can resolve this"
      })
    }
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({})
}
