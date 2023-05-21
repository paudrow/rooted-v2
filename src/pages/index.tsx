import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { type UserResource } from "@clerk/types"
import { type Plant } from "@prisma/client"
import { Plus, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/layout"
import { GrowingLoadingSpinner, LoadingPage } from "@/components/loading-page"
import { PlantImage } from "@/components/plant-image"
import SignedInNavBar from "@/components/signed-in-navbar"
import { ThemeToggle } from "@/components/theme-toggle"

const Home: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  if (!isLoaded) return <LoadingPage />

  return (
    <PageLayout>
      {!isSignedIn && <SignUpOrSignIn />}
      {!!isSignedIn && (
        <>
          <Head>
            <title>Rooted Dashboard</title>
          </Head>
          <SignedInNavBar />
          <Dashboard user={user} />
        </>
      )}
    </PageLayout>
  )
}

const SignUpOrSignIn = () => {
  return (
    <>
      <Head>
        <title>Rooted Signin</title>
      </Head>
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Rooted</h1>
          <p className="font-thin italic">Grow with your plants</p>
          <div className="py-4" />
          <Button variant={"default"} className="w-full">
            <SignUpButton />
          </Button>
          <div className="py-2" />
          <div className="flex flex-col">
            <span className="text-foreground opacity-70">
              Already have an account?
            </span>
            <Button variant={"secondary"}>
              <SignInButton />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

const Dashboard = ({ user }: { user: UserResource }) => {
  const { data, isLoading: isPlantsLoading } = api.plant.getAll.useQuery()

  return (
    <div className="px-4">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-2xl">
          {user.firstName ? `${user.firstName}'s` : "Your"} plants
        </h1>
        <Link href="/add-plant">
          <Button variant={"secondary"} className="flex flex-row gap-1">
            <Plus size={24} />
            <span>Add a plant</span>
          </Button>
        </Link>
      </div>
      <div className="py-2" />
      {!!isPlantsLoading && <GrowingLoadingSpinner />}
      {!isPlantsLoading && (
        <div className="flex flex-col justify-center gap-4">
          {!data && <div>Something went wrong</div>}
          {data &&
            data.map((plant) => (
              <Link key={plant.id} href={`/plant/${plant.id}`}>
                <Plant plant={plant} />
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}

const Plant = ({ plant }: { plant: Plant }) => {
  return (
    <div className="flex flex-row items-center gap-4 rounded-lg border p-4">
      <PlantImage
        imageUrl={plant.imageUrl}
        name={plant.name}
        iconSize={8}
        size={10}
      />
      {plant.name}
    </div>
  )
}

export default Home
