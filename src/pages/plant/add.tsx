import { useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

import { PageLayout } from "@/components/layout"

const Home: NextPage = () => {
  const [plantName, setPlantName] = useState("")

  const ctx = api.useContext()

  const { mutate, isLoading: isAdding } = api.plant.create.useMutation({
    onSuccess: () => {
      console.log("success")
      setPlantName("")
      void ctx.plant.getForUser.invalidate()
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
        />
        <button onClick={() => mutate({ name: plantName })} disabled={isAdding}>
          Add Plant
        </button>
      </PageLayout>
    </>
  )
}

export default Home
