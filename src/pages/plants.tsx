import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"

import { PageLayout } from "@/components/layout"

const Home: NextPage = () => {
  const { data, isLoading } = api.plant.getAll.useQuery()

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
          {data &&
            data.map((plant) => (
              <Link key={plant.id} href={`/plant/${plant.id}`}>
                <div>{plant.name}</div>
              </Link>
            ))}
        </div>
      </PageLayout>
    </>
  )
}

export default Home
