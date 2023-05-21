import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { type WaterEvent } from "@prisma/client"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { LoadingPage } from "@/components/loading-page"
import { PlantImage } from "@/components/plant-image"
import SignedInNavBar from "@/components/signed-in-navbar"

const SinglePlantPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id,
    })

  if (isPlantLoading) return <LoadingPage />
  if (!plantData) return <ErrorPage message="Plant not found" />

  return (
    <>
      <PageLayout>
        <Head>
          <title>{plantData.name}</title>
        </Head>
        <SignedInNavBar />
        <div className="flex grow flex-col items-center px-4">
          <div className="flex flex-col items-center gap-2">
            <PlantImage
              imageUrl={plantData.imageUrl}
              altText={plantData.name}
              size="large"
            />
            <div className="flex flex-row items-center gap-1">
              <h1 className="text-2xl">{plantData.name}</h1>{" "}
              <Link href={`/plant/${plantData.id}/edit`}>
                <div className="text-xs font-thin">Edit</div>
              </Link>
            </div>
            <div className="opacity-70">
              Next check on {plantData.nextWaterDate.toLocaleDateString()}
              {plantData.lastWaterDate && (
                <span>
                  {" - "}last watered on{" "}
                  {plantData.lastWaterDate.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
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
  if (!eventData) return <ErrorPage message="Events not found" />

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
      <div className="flex w-full flex-col gap-4">
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
    <Link href={`/event/${props.event.id}`}>
      <div className="flex w-full grow flex-col rounded-md border p-4">
        <div>
          {props.event.date.toLocaleDateString()}
          <span className="opacity-70">
            {" - "} {props.event.type}
          </span>
        </div>
      </div>
    </Link>
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
