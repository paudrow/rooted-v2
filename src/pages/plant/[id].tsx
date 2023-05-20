import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"
import { Sprout } from "lucide-react"

import { PageLayout } from "@/components/layout"
import LoadingPage from "@/components/loading-page"
import SignedInNavBar from "@/components/signed-in-navbar"

const SinglePlantPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: plantData, isLoading: isPlantLoading } =
    api.plant.getById.useQuery({
      id,
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
          <title>{plantData.name}</title>
        </Head>
        <SignedInNavBar />
        <div className="flex grow flex-col items-center">
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
