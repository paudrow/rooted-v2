import { Sprout } from "lucide-react"

import { cn } from "@/lib/utils"

export function PlantImage(props: {
  imageUrl: string | null | undefined
  size: "small" | "medium" | "large"
  altText: string
}) {
  return (
    <div
      className={cn(
        props.size === "small" && "h-10 w-10",
        props.size === "medium" && "h-16 w-16",
        props.size === "large" && "h-24 w-24",
        "overflow-hidden rounded-full border border-foreground"
      )}
    >
      {!props.imageUrl && (
        <div className="flex h-full w-full items-center justify-center bg-secondary">
          <Sprout
            className={cn(
              props.size === "small" && "h-6 w-6",
              props.size === "medium" && "h-6 w-6",
              props.size === "large" && "h-8 w-8"
            )}
          />
        </div>
      )}
      {!!props.imageUrl && (
        <img
          className="h-full w-full object-cover"
          src={props.imageUrl}
          alt={props.altText}
        />
      )}
    </div>
  )
}
