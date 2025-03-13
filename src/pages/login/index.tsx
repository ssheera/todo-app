import { CheckCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { signIn } from "@/redux/reducers/authReducer"
import { useSearchParams } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email()
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const searchParams = useSearchParams()
  const message = searchParams.get("error")

  const { loading, error, sentMagicLink } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (formData: FormValues) => {
    dispatch(signIn(formData.email))
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      { message && (
        <AlertDialog defaultOpen={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>
                An error occurred while sending the magic link
                <br />
                <br />
                <span className="text-sm text-red-500">{message}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="w-full max-w-sm border rounded-md p-4 bg-accent shadow-lg">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <div className="px-2">
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <CheckCheck className="size-6" />
                </div>
                <span className="sr-only">Todo List</span>
              </Link>
              <h1 className="text-xl font-bold">Todo List</h1>
              <p className="text-muted-foreground text-sm">
                Your personal todo list is waiting for you
              </p>
            </div>
          </div>
          
          { sentMagicLink ? (
            <p className="text-sm text-muted-foreground text-center">Check your email for a magic link</p>
          ) : (
            <div className="px-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="name@example.com" {...field} className="bg-background text-sm " />
                            </FormControl>
                            <FormDescription>
                              We will send you a magic link to sign in to your account
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
                        { loading ? "Sending..." : "Continue with Email" }
                      </Button>
                      { error && (
                        <p className="text-xs text-red-500">{error}</p>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          <div className="px-2">
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link>{" "}
              and <Link href="/privacy-policy">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
