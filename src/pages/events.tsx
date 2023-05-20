import Head from "next/head"

import { PageLayout } from "@/components/layout"
import SignedInNavBar from "@/components/signed-in-navbar"

export default function EventsPage() {
  return (
    <PageLayout>
      <Head>
        <title>Rooted Events</title>
      </Head>
      <SignedInNavBar />
      <h1>Events</h1>
    </PageLayout>
  )
}
