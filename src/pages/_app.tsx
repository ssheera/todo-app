import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from "react-redux"
import { store } from "@/redux/store"
import type { AppProps } from 'next/app'
import { Toaster } from "@/components/ui/sonner"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <Toaster theme="dark" position="top-right" closeButton />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
} 