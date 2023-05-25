import { type Metadata } from "next"
import { type AppType } from "next/app"
import { api } from "@/utils/api"

import "@/styles/globals.css"
import Head from "next/head"
import { ClerkProvider } from "@clerk/nextjs"

import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import "@uploadthing/react/styles.css"

export const metadata: Metadata = {
  // title: {
  //   default: siteConfig.name,
  //   template: `%s - ${siteConfig.name}`,
  // },
  // description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Catamaran&family=Open+Sans:ital,wght@1,600&family=Paytone+One&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="text-primary">
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Component {...pageProps} />
            <Toaster />
            <TailwindIndicator />
          </ThemeProvider>
        </ClerkProvider>
      </div>
    </>
  )
}

export default api.withTRPC(MyApp)
