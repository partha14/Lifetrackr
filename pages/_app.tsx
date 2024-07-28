import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import Error from './_error'

function MyApp({ Component, pageProps }: AppProps) {
  if (pageProps.error) {
    return <Error statusCode={pageProps.error.statusCode} />
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
