import { configureStore } from "@reduxjs/toolkit"
import todoReducer from "@/redux/reducers/todoReducer"
import authReducer from "@/redux/reducers/authReducer"

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

