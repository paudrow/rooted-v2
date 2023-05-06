import type { PropsWithChildren } from "react"

import { TailwindIndicator } from "./tailwind-indicator"
import { ThemeToggle } from "./theme-toggle"

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-screen justify-center">
      <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-2xl">
        {props.children}
        <ThemeToggle />
      </div>
    </main>
  )
}
