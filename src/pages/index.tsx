import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { SignInButton, SignOutButton, SignUpButton, useUser } from "@clerk/nextjs";
import { PageLayout } from "@/components/layout";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const {user, isSignedIn, isLoaded} = useUser();

  return (
    <>
      <Head>
        <title>Rooted App</title>
        <meta name="description" content="Grow with your plants!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="h-screen flex justify-center center-items">
          {!isSignedIn && <SignInButton />}
          {!!isSignedIn && (
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center">Hi {user.firstName}</div>
              <SignOutButton />
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default Home;
