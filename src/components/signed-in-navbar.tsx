import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

import { ThemeToggle } from "./theme-toggle"

export const SignedInNavBar = () => {
  return (
    <>
      <div className="border-b-2 border-secondary px-4">
        <div className="flex h-14 w-full flex-row justify-between">
          <div className="flex flex-row items-center gap-4">
            <NavBarButton href="/" text="Home" />
            <NavBarButton href="/events" text="Events" />
          </div>
          <div className="flex flex-row items-center">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
      <div className="pb-8" />
    </>
  )
}

export default SignedInNavBar

export const NavBarButton = (props: { href: string; text: string }) => {
  return (
    <Link href={props.href}>
      <div>{props.text}</div>
    </Link>
  )
}
