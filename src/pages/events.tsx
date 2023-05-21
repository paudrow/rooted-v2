import Head from "next/head"
import { api } from "@/utils/api"
import { useUser } from "@clerk/nextjs"
import { type WaterEvent } from "@prisma/client"

import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { GrowingLoadingSpinner, LoadingPage } from "@/components/loading-page"
import SignedInNavBar from "@/components/signed-in-navbar"

export default function EventsPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { data: eventData, isLoading: isEventLoading } =
    api.event.getAll.useQuery()

  if (!isUserLoaded) return <LoadingPage />
  if (!user)
    return <ErrorPage message="You must be signed in to view this page" />
  if (!eventData) return <ErrorPage message="Event not found" />

  return (
    <PageLayout>
      <Head>
        <title>Rooted Events</title>
      </Head>
      <SignedInNavBar />
      {!!isEventLoading && <GrowingLoadingSpinner />}
      {!isEventLoading && (
        <>
          <h1 className="text-2xl">
            {user.firstName ? `${user.firstName}'s` : "Your"} events
          </h1>
          {!eventData && <div>Something went wrong</div>}
          {!!eventData && (
            <div>
              {eventData.map((event) => (
                <Event
                  event={event}
                  plantName={event.plant.name}
                  plantImageUrl={event.plant.imageUrl}
                />
              ))}
            </div>
          )}
        </>
      )}
      <h1>Events</h1>
    </PageLayout>
  )
}

function Event(props: {
  event: WaterEvent
  plantName: string
  plantImageUrl: string | null
}) {
  return (
    <div>
      {props.event.type} on {props.event.date.toLocaleDateString()}
    </div>
  )
}
