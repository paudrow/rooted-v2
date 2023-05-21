import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { type UserResource } from "@clerk/types"
import { type Plant } from "@prisma/client"
import { Plus, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import ErrorPage from "@/components/error-page"
import { PageLayout } from "@/components/layout"
import { LoadingPage } from "@/components/loading-page"
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
            <title>Röoted Dashboard</title>
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
        <title>Röoted Signin</title>
      </Head>
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Röoted</h1>
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
  const { data: plantData, isLoading } = api.plant.getAll.useQuery()

  if (isLoading) return <LoadingPage />
  if (!plantData) return <ErrorPage message="Something went wrong" />

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
      <div className="flex flex-col justify-center gap-4">
        <h1 className="text-xl">Plants to check</h1>
        {plantData.due.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Sprout size={64} />
            <span className="text-foreground opacity-70">
              You don{"'"}t have any plants to check!
            </span>
          </div>
        )}
        {plantData.due.map((plant) => (
          <Plant
            key={plant.id}
            plant={plant}
            lastWaterDate={plant.lastWaterDate}
            nextWaterDate={plant.nextWaterDate}
          />
        ))}
        {plantData.notDue.length > 0 && (
          <>
            <h1 className="text-xl">Plants not due</h1>
            {plantData.notDue.map((plant) => (
              <Plant
                key={plant.id}
                plant={plant}
                lastWaterDate={plant.lastWaterDate}
                nextWaterDate={plant.nextWaterDate}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

const Plant = (props: {
  plant: Plant
  lastWaterDate: Date | undefined
  nextWaterDate: Date
}) => {
  return (
    <Link href={`/plant/${props.plant.id}`}>
      <div className="flex flex-row items-center gap-4 rounded-md border p-4">
        <PlantImage
          imageUrl={props.plant.imageUrl}
          altText={props.plant.name}
          size="small"
        />
        <div className="flex w-full flex-col">
          <div className="text-lg">{props.plant.name}</div>
          <div className="opacity-70k flex w-full flex-row justify-between">
            <span>
              Next watering: {props.nextWaterDate.toLocaleDateString()}
            </span>
            {props.lastWaterDate && (
              <span>
                Last watered: {props.lastWaterDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Home
