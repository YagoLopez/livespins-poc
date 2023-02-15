import type { AppProps } from "next/app"
import { QueryClientProvider } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { store } from "../redux/store"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useEffect } from "react"
import "../styles/globals.css"

const REACT_QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
}

function MyApp({ Component, pageProps }: AppProps) {
  // This is needed to import tailwind elements
  useEffect(() => {
    const use = async () => {
      // @ts-ignore
      ;(await import("tw-elements")).default
    }
    use()
  }, [])

  return (
    <QueryClientProvider client={new QueryClient(REACT_QUERY_CONFIG)}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
