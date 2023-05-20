import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
// import { api } from "@/utils/api"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { type UserResource } from "@clerk/types"
import { type Plant } from "@prisma/client"
import { Plus, Sprout } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/layout"
import LoadingPage from "@/components/loading-page"
import { ThemeToggle } from "@/components/theme-toggle"

const Home: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()

  return (
    <PageLayout>
      <Head>
        <title>Rooted Dashboard</title>
      </Head>
      {!isLoaded && <LoadingPage />}
      {!!isLoaded && (
        <>
          {!isSignedIn && (
            <div className="flex h-full w-full items-center justify-center">
              <Button variant={"default"}>
                <SignInButton />
              </Button>
            </div>
          )}
          {!!isSignedIn && (
            <>
              <div className="border-b px-4">
                <SignedInNavBar />
              </div>
              <div className="p-4" />
              <div className="px-4">
                <Dashboard user={user} />
              </div>
            </>
          )}
        </>
      )}
    </PageLayout>
  )
}

const Dashboard = ({ user }: { user: UserResource }) => {
  const { data, isLoading: isPlantsLoading } = api.plant.getAll.useQuery()

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-2xl">
          {user.firstName ? `${user.firstName}'s` : "Your"} plants
        </div>
        <Link href="/add-plant">
          <Button variant={"secondary"} className="flex flex-row gap-1">
            <Plus size={24} />
            <span>Add a plant</span>
          </Button>
        </Link>
      </div>
      <div className="py-2" />
      {!!isPlantsLoading && <LoadingPage spinnerSize={20} />}
      {!isPlantsLoading && (
        <div className="flex flex-col justify-center gap-4">
          {!data && <div>Something went wrong</div>}
          {data && data.map((plant) => <Plant key={plant.id} plant={plant} />)}
        </div>
      )}
    </>
  )
}

const Plant = ({ plant }: { plant: Plant }) => {
  return (
    <Link href={`/plant/${plant.id}`}>
      <div className="flex flex-row items-center gap-4 rounded-lg border p-4">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-foreground">
          {!plant.imageUrl && (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Sprout className="h-6 w-6 grow" />
            </div>
          )}
          {!!plant.imageUrl && (
            <img src={plant.imageUrl} alt={plant.name} className="grow" />
          )}
        </div>
        {plant.name}
      </div>
    </Link>
  )
}

const SignedInNavBar = () => {
  return (
    <div className="flex h-14 w-full flex-row justify-between">
      <div className="flex flex-row items-center gap-4">
        <NavBarButton href="/" text="Home" />
        <NavBarButton href="/events" text="Events" />
      </div>
      <div className="flex flex-row items-center">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  )
}

const NavBarButton = (props: { href: string; text: string }) => {
  return (
    <Link href={props.href}>
      <div>{props.text}</div>
    </Link>
  )
}

export default Home
