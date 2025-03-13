import { processTask } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
	const supabase = await createClient({ req, res })

	const { data, error } = await supabase.auth.getUser()

	if (error) return res.status(500).json({ error: error.message })

	const user = data.user

	if (!user) return res.status(401).json({ error: 'Unauthorized' })

	switch (req.method) {
		case 'POST': {
			const { title } = req.body
			if (!title) return res.status(400).json({ error: 'Title is required' })

			const task = await processTask(title)
			
			const { data, error } = await supabase.from('tasks').insert({
				title: task.title ?? title,
				description: task.description ?? '',
				due_at: task.due_date ? new Date(task.due_date) : null,
				user_id: user.id
			}).select('*').single()
			if (error) return res.status(500).json({ error: error.message })
			return res.status(200).json(data)
		}
		default:
			return res.status(405).json({ error: 'Method not allowed' })
	}
}
