import { useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

import { useToast } from "@/components/ui/use-toast"
import { PageLayout } from "@/components/layout"
import { PlantNameInput } from "@/components/plant-name-input"
import SignedInNavBar from "@/components/signed-in-navbar"
import { UploadPlantImageUrl } from "@/components/upload-plant-image-url"

const Home: NextPage = () => {
  const [plantName, setPlantName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  const ctx = api.useContext()
  const { toast } = useToast()

  const { mutate, isLoading: isAdding } = api.plant.create.useMutation({
    onSuccess: () => {
      console.log("success")
      setPlantName("")
      setImageUrl(undefined)
      void ctx.plant.getAll.invalidate()
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
      <UploadPlantImageUrl imageUrl={imageUrl} setImageUrl={setImageUrl} />
      <PlantNameInput plantName={plantName} setPlantName={setPlantName} />
      <button
        onClick={() => mutate({ name: plantName, imageUrl })}
        disabled={isAdding}
      >
        Add Plant
      </button>
    </PageLayout>
  )
}

export default Home
