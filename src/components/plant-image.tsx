import { Sprout } from "lucide-react"

import { cn } from "@/lib/utils"

export function PlantImage(props: {
  imageUrl: string | null | undefined
  iconSize: number
  size: number
  altText: string
}) {
  return (
    <div
      className={cn(
        `h-${props.size} w-${props.size}`,
        "overflow-hidden rounded-full border border-foreground"
      )}
    >
      {!props.imageUrl && (
        <div className="flex h-full w-full items-center justify-center bg-secondary">
          <Sprout className={cn(`h-${props.iconSize} w-${props.iconSize}`)} />
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
