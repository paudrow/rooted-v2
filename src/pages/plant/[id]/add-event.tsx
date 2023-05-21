import { useState } from "react"
import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"
import { type WaterEventType } from "@prisma/client"

import { Button } from "@/components/ui/button"
import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { LoadingPage } from "@/components/loading-page"
import PickDatePopover from "@/components/pick-date-popover"
import SelectWateringEvent from "@/components/select-watering-event"
import SignedInNavBar from "@/components/signed-in-navbar"

const AddEventToPlantPage: NextPage<{ id: string }> = ({ id: plantId }) => {
  const [eventType, setEventType] = useState<WaterEventType | null>(null)
  const [eventDate, setEventDate] = useState<Date>(new Date())

  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id: plantId,
    })

  const { mutate, isLoading: isAdding } = api.event.create.useMutation({
    onSuccess: (data) => {
      console.log(data)
      alert("Event added!")
    },
    onError: (error) => {
      console.error(error)
    },
  })

  if (isPlantLoading) return <LoadingPage />
  if (!plantData) return <ErrorPage message="Plant not found" />

  return (
    <>
      <PageLayout>
        <Head>
          <title>Add event for {plantData.name}</title>
        </Head>
        <SignedInNavBar />
        <div className="px-4">
          <h1 className="text-2xl">
            Add event for {'"'}
            {plantData.name}
            {'"'}
          </h1>
          <PickDatePopover
            date={eventDate}
            setDate={setEventDate}
            isTodayOrEarlier={true}
          />
          <SelectWateringEvent
            onValueChange={(value) => {
              console.log(value)
              setEventType(value as WaterEventType)
            }}
          />
          <Button
            variant={"default"}
            disabled={isAdding || !eventType}
            onClick={() => {
              mutate({
                plantId: plantId,
                type: eventType!,
                date: new Date().toISOString(),
              })
            }}
          >
            Add event
          </Button>
        </div>
      </PageLayout>
    </>
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

export default AddEventToPlantPage
