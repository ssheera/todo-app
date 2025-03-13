import { createClient } from "@/lib/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
  const supabase = await createClient({ req, res })

  const { data, error } = await supabase.auth.getUser()

  if (error) return res.status(500).json({ error: error.message })

  const user = data.user

  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const id = req.query.id as string

  if (!id) return res.status(400).json({ error: 'Id is required' })

  switch (req.method) {
    case 'DELETE': {
      const { data, error } = await supabase.from('tasks').delete().eq('id', id).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    }
    case 'PUT': {
      const item = {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        due_at: req.body.due_at,
        updated_at: new Date(),
      }
      const { data, error } = await supabase.from('tasks').update(item).eq('id', id).select('*').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    }
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}
