import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from "react-redux"
import { store } from "@/redux/store"
import type { AppProps } from 'next/app'
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <Toaster theme="dark" position="top-right" closeButton />
        <Analytics />
        <SpeedInsights />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
} 