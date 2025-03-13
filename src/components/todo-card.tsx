import { TodoItem, updateTodo } from "@/redux/reducers/todoReducer"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Calendar1, CalendarDays, CalendarFold, CalendarPlus, Trash2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch } from "@/lib/hooks"

const todoSchema = z.object({
  completed: z.boolean().optional().nullable(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable()
})

type FormValues = z.infer<typeof todoSchema>

export default function TodoCard({ item, onDelete }: { item: TodoItem, onDelete: (id: number) => void }) {

  const dispatch = useAppDispatch()

  const form = useForm<FormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      dueDate: item.due_at ? new Date(item.due_at) : undefined,
      completed: item.completed,
    },
  })

  function getDueDate(due: Date) {

    const now = new Date()
    
    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const diffTime = dueDate.getTime() - nowDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    
    if (diffDays === 0) {
      return "Today"
    } 
    else if (diffDays === 1) {
      return "Tomorrow"
    } 
    else {
      return `${due.toLocaleDateString('default', { weekday: 'short' })} ${due.getDate()} ${due.toLocaleString('default', { month: 'long' })} ${due.getFullYear()}`
    }
  }

  function getDayOn(days: number) {
    const now = new Date()
    const due = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    return due.toLocaleDateString('default', { weekday: 'short' })
  }

  const onSubmit = async (data: FormValues) => {
    const now = new Date()
    const update = {
      title: data.title === item.title ? undefined : data.title,
      description: data.description === item.description ? undefined : data.description,
      completed: data.completed === item.completed ? undefined : data.completed,
      created_at: undefined,
      updated_at: undefined,
      due_at: data.dueDate?.getDay() === now.getDay() && data.dueDate?.getMonth() === now.getMonth() && data.dueDate?.getFullYear() === now.getFullYear() ? undefined : data.dueDate
    }
    if (Object.values(update).every(value => value === undefined)) return
    await dispatch(updateTodo({
      id: item.id,
      ...update
    })).unwrap()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Sheet onOpenChange={(open) => { if (!open) form.handleSubmit(onSubmit)() }}>
          <ContextMenu>
            <SheetTrigger asChild>
              <ContextMenuTrigger asChild>
                <div className="flex flex-col border p-3 rounded-md hover:bg-accent/50 transition-all duration-300 bg-accent cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="completed"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value ?? false}
                              onCheckedChange={(checked) => {
                                field.onChange(checked)
                                form.handleSubmit(onSubmit)()
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="border-gray-400 border-2 size-5 m-auto"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="w-full">
                      <p className="text-sm">{item.title}</p>
                      {item.due_at && (
                        <p className="pt-1 flex gap-2 text-xs text-gray-500 text-ellipsis line-clamp-2">
                          <CalendarDays className="size-4" /> {getDueDate(new Date(item.due_at))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ContextMenuTrigger>
            </SheetTrigger>
            <ContextMenuContent>
              <ContextMenuItem variant="destructive" className="flex flex-row gap-4" onClick={() => onDelete(item.id!)}>
                <Trash2 className="size-4" />
                Delete Task
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <SheetContent overlayProps={{ className: "bg-transparent" }} className="w-full sm:max-w-[400px] bg-accent overflow-auto gap-0">
            <SheetHeader>
              <SheetTitle>Edit Task</SheetTitle>
              <SheetDescription className="flex flex-col gap-4">
                Edit your task, add a due date, or add notes.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex gap-1 border rounded-md bg-background py-1 px-3">
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            form.handleSubmit(onSubmit)()
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="border-gray-400 border-2 size-5 my-auto"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none text-sm "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4 border rounded-md bg-background">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-none gap-4 justify-start hover:bg-accent/50 text-gray-300 font-normal">
                              <CalendarDays className="size-4" />
                              { field.value ? getDueDate(field.value) : "Add due date" }
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="min-w-[250px] bg-background">
                            { field.value && (
                              <DropdownMenuItem 
                                className="flex flex-row gap-8 justify-between"
                                onClick={() => field.onChange(null)}
                              >
                                <span className="flex flex-row gap-2">
                                  <X className="size-5" />
                                  Clear
                                </span>
                              </DropdownMenuItem>
                            ) }
                            <DropdownMenuItem 
                              className="flex flex-row gap-8 justify-between"
                              onClick={() => field.onChange(new Date())}
                            >
                              <span className="flex flex-row gap-2">
                                <CalendarFold className="size-5" />
                                Today
                              </span>
                              <span className="text-gray-300">
                                {getDayOn(0)}
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex flex-row gap-8 justify-between"
                              onClick={() => field.onChange(new Date(new Date().setDate(new Date().getDate() + 1)))}
                            >
                              <span className="flex flex-row gap-2">
                                <Calendar1 className="size-5" />
                                Tomorrow
                              </span>
                              <span className="text-gray-300">
                                {getDayOn(1)}
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex flex-row gap-8 justify-between"
                              onClick={() => field.onChange(new Date(new Date().setDate(new Date().getDate() + 7)))}
                            >
                              <span className="flex flex-row gap-2">
                                <CalendarPlus className="size-5" />
                                Next Week
                              </span>
                              <span className="text-gray-300">
                                {getDayOn(7)}
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4 border rounded-md bg-background">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add notes"
                          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none text-primary text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <SheetFooter>
              <Separator className="bg-primary/20" />
              <div className="flex flex-row gap-4 justify-between">
                <p className="text-xs text-primary/50 my-auto">Created {new Date(item.created_at!).toLocaleDateString()}</p>
                <Button variant="ghost" className="border-none justify-end text-red-500 hover:text-red-500 font-normal" onClick={() => onDelete(item.id!)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  )
}