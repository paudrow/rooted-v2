import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { type WaterEvent } from "@prisma/client"
import { Plus, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/layout"
import LoadingPage from "@/components/loading-page"
import SignedInNavBar from "@/components/signed-in-navbar"

const SinglePlantPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id,
    })

  if (isPlantLoading) return <LoadingPage />

  if (!plantData)
    return (
      <>
        <PageLayout>
          <Head>
            <title>Plant not found</title>
          </Head>
          <h1 className="flex grow items-center justify-center">
            Plant not found
          </h1>
        </PageLayout>
      </>
    )

  return (
    <>
      <PageLayout>
        <Head>
          <title>{plantData.name}</title>
        </Head>
        <SignedInNavBar />
        <div className="flex grow flex-col items-center">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-foreground">
            {!plantData.imageUrl && (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <Sprout className="h-16 w-16" />
              </div>
            )}
            {!!plantData.imageUrl && (
              <img src={plantData.imageUrl} alt={plantData.name} />
            )}
          </div>
          <h1>{plantData.name}</h1>
          <EventList plantId={plantData.id} />
        </div>
      </PageLayout>
    </>
  )
}

const EventList = (props: { plantId: string }) => {
  const { data: eventData, isLoading: isEventsLoading } =
    api.event.getAllForPlant.useQuery({
      plantId: props.plantId,
    })

  if (isEventsLoading) return <LoadingPage />

  if (!eventData) return <div>Something went wrong</div>

  const addEventHref = `/plant/${props.plantId}/add-event`
  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-2xl">Events</div>
        <Link href={addEventHref}>
          <Button variant={"secondary"} className="flex flex-row gap-1">
            <Plus size={24} />
            <span>Add an event</span>
          </Button>
        </Link>
      </div>
      <div className="pb-4" />
      <div className="flex flex-col gap-4">
        {eventData.length === 0 && (
          <div className="text-center">
            <p>No events yet</p>
            <div className="pb-2" />
            <Link href={addEventHref}>
              <span className="text-accent-foreground underline">
                Add your first one
              </span>
            </Link>
          </div>
        )}
        {eventData.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </div>
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

export default SinglePlantPage
