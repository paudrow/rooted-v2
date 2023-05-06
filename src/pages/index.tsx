import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/utils/api"
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs"

import { Calendar } from "@/components/ui/calendar"
import { PageLayout } from "@/components/layout"

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" })

  const { user, isSignedIn, isLoaded } = useUser()

  return (
    <>
      <Head>
        <title>Rooted App</title>
        <meta name="description" content="Grow with your plants!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="center-items flex h-screen justify-center">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && (
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center">Hi {user.firstName}</div>
              <SignOutButton />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Calendar />
        </div>
      </PageLayout>
    </>
  )
}

export default Home
