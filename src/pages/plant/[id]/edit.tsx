import { useEffect, useState } from "react"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

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

  const { mutate, isLoading: isUpdating } = api.plant.update.useMutation({
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
        <h1 className="text-2xl">Update {plantData.name}</h1>
        <UploadPlantImageUrl imageUrl={imageUrl} setImageUrl={setImageUrl} />
        <PlantNameInput plantName={plantName} setPlantName={setPlantName} />
        <Button
          onClick={() =>
            mutate({ id: plantData.id, name: plantName, imageUrl })
          }
          disabled={isUpdating || !hasChanges()}
        >
          Update Plant
        </Button>
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
