import TodoCard from "@/components/todo-card"
import { addTodo, addTodoAI, deleteTodo, fetchTodos } from "@/redux/reducers/todoReducer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoaderCircleIcon, Sparkles, LogOut } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"
import Link from "next/link"

const newTodoSchema = z.object({
  title: z.string().min(1),
  ai: z.boolean().optional()
})

type FormValues = z.infer<typeof newTodoSchema>

export default function Home() {

  const dispatch = useAppDispatch()

  const { items, fetch, add } = useAppSelector((state) => state.todos)

  const form = useForm<FormValues>({
    resolver: zodResolver(newTodoSchema),
    defaultValues: {
      title: "",
    },
  })

  const shouldFetchTodos = useMemo(() => items.length === 0, [items.length])

  useEffect(() => {
    if (shouldFetchTodos) {
      dispatch(fetchTodos())
    }
  }, [dispatch, shouldFetchTodos])

  const onSubmit = async (data: FormValues) => {
    toast.loading('Adding task...', { id: 'add-task' })
    await dispatch(addTodo({
      title: data.title,
      id: undefined,
      description: undefined,
      completed: undefined,
      created_at: undefined,
      updated_at: undefined,
      due_at: undefined
    })).unwrap()
    toast.success('Task added', { id: 'add-task' })
  }

  const onSubmitAI = async (data: FormValues) => {
    toast.loading('Adding task...', { id: 'add-task' })
    await dispatch(addTodoAI({
      title: data.title,
      id: undefined,
      description: undefined,
      completed: undefined,
      created_at: undefined,
      updated_at: undefined,
      due_at: undefined
    })).unwrap()
    toast.success('Task added', { id: 'add-task' })
  }

  const onDelete = async (id: number) => {
    toast.loading('Deleting task...', { id: 'delete-task' })
    await dispatch(deleteTodo(id)).unwrap()
    toast.success('Task deleted', { id: 'delete-task' })
  }

  return (
    <div className="flex flex-col w-full max-w-[800px] mx-auto h-[100dvh] px-2 md:px-0">

      <div className="sticky top-0 bg-zinc-900 z-40 py-2 px-6 border rounded-md mt-2">
        <div className="flex flex-row justify-between">
          <span className="flex gap-2">
            <p className="text-2xl font-bold">Tasks</p>
            <p className="text-sm text-muted-foreground">({items.length})</p>
          </span>
          <Link href="/logout" className="my-auto text-red-300">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {fetch.loading && (
        <div className="mt-2">
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
        </div>
      )}
      {fetch.error && (
        <div className="mt-2">
          <p className="text-sm text-red-500">Error fetching tasks</p>
        </div>
      )}
  
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-2 pb-16">
          {items.length !== 0 && (
            <>
              {items.filter((item) => !item.completed).map((item) => (
                <TodoCard key={item.id} item={item} onDelete={onDelete} />
              ))}
              {items.filter((item) => item.completed).length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground my-2">Completed</p>
                  {items.filter((item) => item.completed).map((item) => (
                    <TodoCard key={item.id} item={item} onDelete={onDelete} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
  
      <div className="sticky bottom-0 left-0 right-0 bg-background p-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative group">
            <Input
              {...form.register("title")}
              disabled={add.loading}
              className="p-4 pr-12 bg-accent text-sm relative z-10"
              placeholder="Add a task..."
            />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 z-50">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-full text-blue-300 hover:text-blue-300"
                disabled={add.loading}
                onClick={() => form.handleSubmit(onSubmitAI)()}
              >
                <Sparkles className="shrink-0 w-6 h-6" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
