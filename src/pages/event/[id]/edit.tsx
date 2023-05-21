import { useEffect, useState } from "react"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { api } from "@/utils/api"
import { type WaterEventType } from "@prisma/client"
import { set } from "date-fns"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { LoadingPage } from "@/components/loading-page"
import PickDatePopover from "@/components/pick-date-popover"
import { PlantNameInput } from "@/components/plant-name-input"
import SelectWateringEvent from "@/components/select-watering-event"
import SignedInNavBar from "@/components/signed-in-navbar"
import { UploadPlantImageUrl } from "@/components/upload-plant-image-url"

const EditEventPage: NextPage<{ id: string }> = ({ id }) => {
  const [eventType, setEventType] = useState<WaterEventType | null>(null)
  const [eventDate, setEventDate] = useState<Date>(new Date())

  const [lastEventType, setLastEventType] = useState<WaterEventType | null>(
    null
  )
  const [lastEventDate, setLastEventDate] = useState<Date>(new Date())

  const ctx = api.useContext()
  const { toast } = useToast()

  const { data: eventData, isLoading: isEventLoading } =
    api.event.getById.useQuery({
      id,
    })

  const { mutate: updateMutation, isLoading: isUpdating } =
    api.event.updateById.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Event updated",
        })
        void ctx.event.getById.invalidate({ id })
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      },
    })

  const router = useRouter()
  const { mutate: deleteMutation, isLoading: isDeleting } =
    api.event.deleteById.useMutation({
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Event deleted",
        })
        await router.push("/events")
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      },
    })

  useEffect(() => {
    if (!eventData) return
    setEventType(eventData.type)
    setEventDate(eventData.date)

    setLastEventType(eventData.type)
    setLastEventDate(eventData.date)
  }, [eventData])

  if (isEventLoading) return <LoadingPage />
  if (!eventData) return <ErrorPage message="Event not found" />

  const hasChanges = () => {
    return (
      eventType !== lastEventType ||
      eventDate.getTime() !== lastEventDate.getTime()
    )
  }

  return (
    <>
      <Head>
        <title>Edit event</title>
      </Head>
      <PageLayout>
        <SignedInNavBar />
        <div className="flex flex-col gap-4 px-4">
          <h1 className="text-2xl">Edit Event</h1>

          <PickDatePopover
            startingDate={eventDate}
            setDate={setEventDate}
            isTodayOrEarlier={true}
          />
          <SelectWateringEvent
            onValueChange={(value) => {
              setEventType(value as WaterEventType)
            }}
            startingValue={eventType!}
          />
          <div className="flex justify-start">
            <Button
              onClick={() =>
                updateMutation({
                  id: eventData.id,
                  date: eventDate,
                  type: eventType!,
                  plantId: eventData.plantId,
                })
              }
              disabled={isUpdating || !hasChanges()}
            >
              Update event
            </Button>
          </div>
          <div>
            <DeleteButton
              onClick={() => deleteMutation({ id: eventData.id })}
              isDeleting={isDeleting}
            />
          </div>
          <div className="flex justify-start"></div>
        </div>
      </PageLayout>
    </>
  )
}

export default EditEventPage

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

function DeleteButton(props: { onClick: () => void; isDeleting: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Delete event</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={props.onClick}
            disabled={props.isDeleting}
          >
            Delete event
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
