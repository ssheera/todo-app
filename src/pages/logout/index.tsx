import { LoaderCircleIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { GetServerSideProps } from "next"

export default async function LogoutPage() {
  return (
		<div className="flex items-center justify-center h-screen">
			<LoaderCircleIcon className="w-4 h-4 animate-spin" />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	try {
		const supabase = await createClient({ req, res })
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