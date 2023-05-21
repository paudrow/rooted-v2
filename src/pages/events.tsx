import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { useUser } from "@clerk/nextjs"
import { type WaterEvent } from "@prisma/client"

import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { GrowingLoadingSpinner, LoadingPage } from "@/components/loading-page"
import { PlantImage } from "@/components/plant-image"
import SignedInNavBar from "@/components/signed-in-navbar"

export default function EventsPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { data: eventData, isLoading: isEventLoading } =
    api.event.getAll.useQuery()

  if (!isUserLoaded) return <LoadingPage />
  if (!user)
    return <ErrorPage message="You must be signed in to view this page" />
  if (!eventData && !isEventLoading)
    return <ErrorPage message="Failed to load events" />

  return (
    <PageLayout>
      <Head>
        <title>Rooted Events</title>
      </Head>
      <SignedInNavBar />
      <div className="px-4">
        {!!isEventLoading && <GrowingLoadingSpinner />}
        {!isEventLoading && (
          <>
            <h1 className="text-2xl">
              {user.firstName ? `${user.firstName}'s` : "Your"} events
            </h1>
            <div className="py-2" />
            {eventData.length === 0 && (
              <div className="w-full text-center">No events yet</div>
            )}
            {!!eventData && (
              <div className=" flex flex-col justify-center gap-4">
                {eventData.map((event) => (
                  <Link key={event.id} href={`/event/${event.id}`}>
                    <Event
                      event={event}
                      plantName={event.plant.name}
                      plantImageUrl={event.plant.imageUrl}
                    />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}

function Event(props: {
  event: WaterEvent
  plantName: string
  plantImageUrl: string | null
}) {
  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-lg border p-4">
      <PlantImage
        imageUrl={props.plantImageUrl}
        name={props.plantName}
        iconSize={6}
        size={10}
      />
      <p>
        {props.event.type} on {props.event.date.toLocaleDateString()}
      </p>
    </div>
  )
}
