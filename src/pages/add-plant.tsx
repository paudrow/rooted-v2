import { useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

import { useToast } from "@/components/ui/use-toast"
import { PageLayout } from "@/components/layout"
import { PlantNameInput } from "@/components/plant-name-input"
import SignedInNavBar from "@/components/signed-in-navbar"
import { UploadPlantImageUrl } from "@/components/upload-plant-image-url"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

const Home: NextPage = () => {
  const [plantName, setPlantName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  const router = useRouter()
  const { toast } = useToast()

  const { mutate, isLoading: isAdding } = api.plant.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Success",
        description: "Plant added",
      })
      await router.push(`/plant/${data.id}`)
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
    <PageLayout>
      <Head>
        <title>Add a Plant</title>
      </Head>
      <SignedInNavBar />
      <div className="flex flex-col gap-4 px-4">
        <h1 className="text-2xl">
          Add a plant
        </h1>
        <UploadPlantImageUrl imageUrl={imageUrl} setImageUrl={setImageUrl} />
        <PlantNameInput plantName={plantName} setPlantName={setPlantName} />
        <Button
          onClick={() => mutate({ name: plantName, imageUrl })}
          disabled={isAdding || !plantName}
        >
          Add Plant
        </Button>
      </div>
    </PageLayout>
  )
}

export default Home
