import { useEffect, useState } from "react"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

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

  const ctx = api.useContext()
  const { toast } = useToast()

  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id,
    })

  if (isPlantLoading) return <LoadingPage />
  if (!plantData) return <ErrorPage message="Plant not found" />

  useEffect(() => {
    setPlantName(plantData.name)
    setImageUrl(plantData.imageUrl || undefined)
  }, [plantData])

  const { mutate, isLoading: isAdding } = api.plant.update.useMutation({
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

  return (
    <>
      <Head>
        <title>Edit {plantData.name}</title>
      </Head>
      <PageLayout>
        <SignedInNavBar />
        <UploadPlantImageUrl imageUrl={imageUrl} setImageUrl={setImageUrl} />
        <PlantNameInput plantName={plantName} setPlantName={setPlantName} />
        <button
          onClick={() =>
            mutate({ id: plantData.id, name: plantName, imageUrl })
          }
          disabled={isAdding}
        >
          Update Plant
        </button>
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
