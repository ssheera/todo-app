import { createClient } from "@/lib/supabase/server"
import { NextApiRequest, NextApiResponse } from "next"
import { EmailOtpType } from "@supabase/supabase-js"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token_hash, type, next } = req.query

  if (!token_hash || !type) {
    return res.status(400).json({ message: "Missing token_hash or type" })
  }

  const supabase = createClient({ req, res })

  const { error } = await supabase.auth.verifyOtp({
    token_hash: token_hash as string,
    type: type as EmailOtpType
  })

  if (error) {
    return res.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=${encodeURIComponent(error.message)}`)
  }

  const redirectTo = next 
    ? decodeURIComponent(next as string) 
    : (process.env.NEXT_PUBLIC_URL as string)
  
  return res.redirect(redirectTo)
}