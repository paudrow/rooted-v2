import { cn } from "@/lib/utils"

export const LoadingPage = (props: { spinnerSize?: number }) => {
  return (
    <div className="flex grow items-center justify-center">
      <LoadingSpinner size={props.spinnerSize || 20} />
    </div>
  )
}

export default LoadingPage

export const LoadingSpinner = (props: { size: number }) => {
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
