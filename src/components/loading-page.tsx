import { cn } from "@/lib/utils"

import { PageLayout } from "./layout"

export function LoadingPage() {
  return (
    <PageLayout>
      <GrowingLoadingSpinner />
    </PageLayout>
  )
}

export function GrowingLoadingSpinner() {
  return (
    <div className="flex h-full grow items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div
      className={cn(
        `h-20 w-20`,
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
