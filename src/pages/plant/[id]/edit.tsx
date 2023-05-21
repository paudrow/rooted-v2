import { useEffect, useState } from "react"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { api } from "@/utils/api"

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
import { PlantNameInput } from "@/components/plant-name-input"
import SignedInNavBar from "@/components/signed-in-navbar"
import { UploadPlantImageUrl } from "@/components/upload-plant-image-url"

const EditPlantPage: NextPage<{ id: string }> = ({ id }) => {
  const [plantName, setPlantName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  const [lastPlantName, setLastPlantName] = useState("")
  const [lastImageUrl, setLastImageUrl] = useState<string | undefined>()

  const ctx = api.useContext()
  const { toast } = useToast()

  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id,
    })

  const { mutate: updateMutation, isLoading: isUpdating } =
    api.plant.update.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Plant updated",
        })
        void ctx.plant.getById.invalidate({ id })
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
    api.plant.deleteById.useMutation({
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Plant deleted",
        })
        await router.push("/")
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
    if (!plantData) return
    setPlantName(plantData.name)
    setImageUrl(plantData.imageUrl || undefined)

    setLastPlantName(plantData.name)
    setLastImageUrl(plantData.imageUrl || undefined)
  }, [plantData])

  if (isPlantLoading) return <LoadingPage />
  if (!plantData) return <ErrorPage message="Plant not found" />

  const hasChanges = () => {
    return plantName !== lastPlantName || imageUrl !== lastImageUrl
  }

  return (
    <>
      <Head>
        <title>Edit {plantData.name}</title>
      </Head>
      <PageLayout>
        <SignedInNavBar />
        <div className="flex flex-col gap-4 px-4">
          <h1 className="text-2xl">Update {plantData.name}</h1>

          <UploadPlantImageUrl imageUrl={imageUrl} setImageUrl={setImageUrl} />
          <div>
            <PlantNameInput plantName={plantName} setPlantName={setPlantName} />
          </div>
          <div className="flex justify-start">
            <Button
              onClick={() =>
                updateMutation({ id: plantData.id, name: plantName, imageUrl })
              }
              disabled={isUpdating || !hasChanges()}
            >
              Update Plant
            </Button>
          </div>
          <div>
            <DeleteButton
              onClick={() => deleteMutation({ id: plantData.id })}
              isDeleting={isDeleting}
            />
          </div>
          <div className="flex justify-start"></div>
        </div>
      </PageLayout>
    </>
  )
}

export default EditPlantPage

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
        <Button variant="destructive">Delete plant</Button>
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
            hidden={false}
            onClick={props.onClick}
            disabled={props.isDeleting}
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
