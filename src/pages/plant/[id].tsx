import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

const SinglePlantPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.plant.getById.useQuery({
    id,
  })
  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>
      <div className="flex flex-col items-center justify-center">
        {data.imageUrl && (
          <img
            src={data.imageUrl}
            alt={data.name}
            className="h-20 w-20 rounded-full"
          />
        )}
        <h1>{data.name}</h1>
      </div>
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
