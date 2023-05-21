import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { type WaterEvent } from "@prisma/client"
import { Sprout } from "lucide-react"

import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { LoadingPage } from "@/components/loading-page"
import { PlantImage } from "@/components/plant-image"
import SignedInNavBar from "@/components/signed-in-navbar"

const SingleEventPage: NextPage<{ id: string }> = ({ id: eventId }) => {
  const { data, isLoading } = api.event.getById.useQuery({
    id: eventId,
  })

  if (isLoading) return <LoadingPage />
  if (!data) return <ErrorPage message="Event not found" />

  return (
    <>
      <PageLayout>
        <Head>
          <title>{data.type}</title>
        </Head>
        <SignedInNavBar />
        <div className="flex grow flex-col items-center">
          <PlantImage
            imageUrl={data.plant.imageUrl}
            name={data.plant.name}
            iconSize={16}
            size={20}
          />
          <Event event={data} />
        </div>
      </PageLayout>
    </>
  )
}

const Event = (props: { event: WaterEvent }) => {
  return (
    <div>
      {props.event.type} on {props.event.date.toLocaleDateString()}
    </div>
  )
}

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id

  if (typeof id !== "string") throw new Error("no id")

  return {
    props: {
      id,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default SingleEventPage
