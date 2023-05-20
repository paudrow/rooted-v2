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
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const Home: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()

  return (
    <>
      <Head>
        <title>Rooted App</title>
        <meta name="description" content="Grow with your plants!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        {!isLoaded && <LoadingPage />}
        {!!isLoaded && (
          <>
            {!isSignedIn && (
              <Button variant={"default"}>
                <SignInButton />
              </Button>
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
    </>
  )
}

const Dashboard = ({ user }: { user: UserResource }) => {
  const { data, isLoading: isPlantsLoading } = api.plant.getAll.useQuery()

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-2xl">{`${user.firstName}'s`} plants</div>
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

const LoadingPage = (props: { spinnerSize?: number }) => {
  return (
    <div className="flex grow items-center justify-center">
      <LoadingSpinner size={props.spinnerSize || 20} />
    </div>
  )
}

const LoadingSpinner = (props: { size: number }) => {
  return (
    <div
      className={cn(
        `h-${props.size} w-${props.size}`,
        "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  )
}

export default Home
