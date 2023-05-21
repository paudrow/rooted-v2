import Head from "next/head"

import { PageLayout } from "./layout"

export default function ErrorPage(props: { message: string }) {
  return (
    <PageLayout>
      <Head>
        <title>{props.message}</title>
      </Head>
      <h1 className="flex grow items-center justify-center">{props.message}</h1>
    </PageLayout>
  )
}
