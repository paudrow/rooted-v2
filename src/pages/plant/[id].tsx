import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

const SinglePlantPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.plant.getById.useQuery({
    id,
  })
  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>
      <div>
        <h1>{data.name}</h1>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
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
