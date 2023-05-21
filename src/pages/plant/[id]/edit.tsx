import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { type WaterEvent } from "@prisma/client"
import { Plus, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { LoadingPage } from "@/components/loading-page"
import { PlantImage } from "@/components/plant-image"
import SignedInNavBar from "@/components/signed-in-navbar"

const SinglePlantPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id,
    })

  const ctx = api.useContext()

  const { mutate, isLoading: isModifying } = api.plant.update.useMutation({
    onSuccess: () => {
      void ctx.plant.getById.invalidate({ id })
    },
    onError: (error) => {
      alert(error)
    },
  })

  if (isPlantLoading) return <LoadingPage />
  if (!plantData) return <ErrorPage message="Plant not found" />

  return (
    <>
      <PageLayout>
        <Head>
          <title>{plantData.name}</title>
        </Head>
        <SignedInNavBar />
        <div className="flex grow flex-col items-center px-4">
          <PlantImage
            imageUrl={plantData.imageUrl}
            altText={plantData.name}
            iconSize={16}
            size={24}
          />
          <h1>{plantData.name}</h1>
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

export default SinglePlantPage
