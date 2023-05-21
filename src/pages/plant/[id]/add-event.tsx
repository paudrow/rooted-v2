import { useState } from "react"
import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { type WaterEvent, WaterEventType } from "@prisma/client"
import { format } from "date-fns"
import dayjs from "dayjs"
import { Calendar as CalendarIcon, Plus, Sprout } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageLayout } from "@/components/layout"
import LoadingPage from "@/components/loading-page"
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
          <title>Add event for {plantData.name}</title>
        </Head>
        <SignedInNavBar />
        <div className="px-4">
          <h1 className="text-2xl">
            Add event for {'"'}
            {plantData.name}
            {'"'}
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !eventDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDate ? (
                  format(eventDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={eventDate}
                onSelect={(date) => {
                  if (date) setEventDate(date)
                }}
                initialFocus
                toDate={dayjs().hour(23).minute(59).second(59).toDate()}
              />
            </PopoverContent>
          </Popover>
          <Select
            onValueChange={(value) => {
              console.log(value)
              setEventType(value as WaterEventType)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Water events</SelectLabel>
                {Object.values(WaterEventType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
        {/* <div className="flex grow flex-col items-center">
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
        </div> */}
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

  const addEventHref = `/${props.plantId}/add-event`
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
    <>
      {props.event.type} on
      {props.event.date.toLocaleDateString()}
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
