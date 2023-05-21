import { useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"
import type { OurFileRouter } from "@/server/uploadthing"
import { api } from "@/utils/api"
import { UploadButton } from "@uploadthing/react"

import { PageLayout } from "@/components/layout"

const Home: NextPage = () => {
  const [plantName, setPlantName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  const ctx = api.useContext()

  const { mutate, isLoading: isAdding } = api.plant.create.useMutation({
    onSuccess: () => {
      console.log("success")
      setPlantName("")
      setImageUrl(undefined)
      void ctx.plant.getAll.invalidate()
    },
    onError: (err) => {
      console.log(err)
    },
  })

  return (
    <>
      <Head>
        <title>Add a Plant</title>
      </Head>
      <PageLayout>
        <input
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="Plant Name"
        />
        {imageUrl && <img src={imageUrl} alt="plant" />}
        <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (!res) {
              return
            }
            console.log("Files: ", res)
            const fileUrl = res[0]?.fileUrl
            if (!fileUrl) {
              return
            }
            setImageUrl(fileUrl)
            alert("Upload Completed")
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`)
          }}
        />
        <button
          onClick={() => mutate({ name: plantName, imageUrl })}
          disabled={isAdding}
        >
          Add Plant
        </button>
      </PageLayout>
    </>
  )
}

export default Home
