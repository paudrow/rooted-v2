import { type NextPage } from "next"
import Head from "next/head"
import { api } from "@/utils/api"

import { PageLayout } from "@/components/layout"

const Home: NextPage = () => {
  const { data, isLoading } = api.plant.getForUser.useQuery()

  if (isLoading) {
    return (
      <div className="flex grow">
        <h1>Loading...</h1>
      </div>
    )
  }

  if (!data) {
    return <div className="flex grow">Something went wrong</div>
  }

  return (
    <>
      <Head>
        <title>Your Plants!</title>
      </Head>
      <PageLayout>
        <div className="flex flex-col justify-center">
          {data && data.map((plant) => <div key={plant.id}>{plant.name}</div>)}
        </div>
      </PageLayout>
    </>
  )
}

export default Home
