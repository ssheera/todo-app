import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/task')
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
)

export const addTodo = createAsyncThunk(
  'todos/addTodo', 
  async (todo: TodoItem, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/task', todo)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
)

export const addTodoAI = createAsyncThunk(
  'todos/addTodoAI',
  async (todo: TodoItem, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/task/ai', todo)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
)

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/task/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
)

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo: TodoItem, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/task/${todo.id}`, todo)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
)

export interface TodoItem {
  id: number | undefined
  title: string | undefined
  description: string | undefined
  completed: boolean | undefined | null
  created_at: Date | undefined
  updated_at: Date | undefined
  due_at: Date | undefined | null
}

export interface TodoState {
  items: TodoItem[]
  fetch: {
    loading: boolean
    error: string | null
  }
  add: {
    loading: boolean
    error: string | null
  }
}

const initialState: TodoState = {
  items: [],
  fetch: {
    loading: false,
    error: null
  },
  add: {
    loading: false,
    error: null
  }
}

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.fetch.loading = true
    })
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.fetch.loading = false
      state.items = action.payload
    })
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.fetch.loading = false
      state.fetch.error = action.payload as string
    })
    builder.addCase(addTodo.pending, (state) => {
      state.add.loading = true
    })
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.add.loading = false
      state.items.push(action.payload)
    })
    builder.addCase(addTodo.rejected, (state, action) => {
      state.add.loading = false
      state.add.error = action.payload as string
    })
    builder.addCase(addTodoAI.pending, (state) => {
      state.add.loading = true
    })
    builder.addCase(addTodoAI.fulfilled, (state, action) => {
      state.add.loading = false
      state.items.push(action.payload)
    })
    builder.addCase(addTodoAI.rejected, (state, action) => {
      state.add.loading = false
      state.add.error = action.payload as string
    })
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id)
    })
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    })
  }
})

export default todoSlice.reducer