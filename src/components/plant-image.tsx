import { Sprout } from "lucide-react"

import { cn } from "@/lib/utils"

export function PlantImage(props: {
  imageUrl: string | null | undefined
  iconSize: number
  size: number
  name: string
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
        <img src={props.imageUrl} alt={`The "${props.name}" plant`} />
      )}
    </div>
  )
}
