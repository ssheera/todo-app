import { LoaderCircleIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { GetServerSideProps } from "next"
import { NextApiRequest, NextApiResponse } from "next"
export default async function LogoutPage() {
  return (
		<div className="flex items-center justify-center h-screen">
			<LoaderCircleIcon className="w-4 h-4 animate-spin" />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	try {
		const supabase = createClient({ req: req as NextApiRequest, res: res as NextApiResponse })
		await supabase.auth.signOut()
	} finally{
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}
}