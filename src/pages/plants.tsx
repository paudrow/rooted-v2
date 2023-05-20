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
        <Link href={"/plant/add"}>Add plant</Link>
        <div className="text-xl">My plants</div>
        <div className="flex flex-col justify-center gap-4">
          {data &&
            data.map((plant) => (
              <Link key={plant.id} href={`/plant/${plant.id}`}>
                <div className="flex flex-row items-center gap-4 rounded-lg border-2 p-4">
                  {plant.imageUrl && (
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  {plant.name}
                </div>
              </Link>
            ))}
        </div>
      </PageLayout>
    </>
  )
}

export default Home
