import { createServerClient, serializeCookieHeader } from "@supabase/ssr"
import { NextApiRequest, NextApiResponse } from "next"

export function createClient({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name]
        },
        set(name: string, value: string, options: any) {
          res.setHeader(
            'Set-Cookie',
            serializeCookieHeader(name, value, options)
          )
        },
        remove(name: string, options: any) {
          res.setHeader(
            'Set-Cookie',
            serializeCookieHeader(name, '', options)
          )
        },
      },
    }
  )
  return supabase
}