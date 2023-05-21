import type { PropsWithChildren } from "react"
import Head from "next/head"

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Head>
        <title>Röoted App</title>
        <meta name="description" content="Grow with your plants!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="overflow-none flex h-screen justify-center">
        <div className="flex h-full w-full flex-col border-x border-border md:max-w-2xl">
          {props.children}
        </div>
      </main>
    </>
  )
}
