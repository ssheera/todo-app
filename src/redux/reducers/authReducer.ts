import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (email: string, { rejectWithValue }) => {
      try {
        const response = await axios.post('/api/auth/login', { email })
        return response.data
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong')
    }
  }
)

export interface AuthState {
  loading: boolean
  error: string | null
  sentMagicLink: boolean
}

const initialState: AuthState = {
  loading: false,
  error: null,
  sentMagicLink: false
}

export const todoSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => [
    builder.addCase(signIn.pending, (state) => {
      state.loading = true
      state.sentMagicLink = false
      state.error = null
    }),
    builder.addCase(signIn.fulfilled, (state) => {
      state.loading = false
      state.sentMagicLink = true
    }),
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  ]
})

export default todoSlice.reducer