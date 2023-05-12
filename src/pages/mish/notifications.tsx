import Image from "next/image"
import { Droplet, Hand, Sprout } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import MishComponent from "@/components/mish-component"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MyPlants() {
  const numbers: number[] = []
  for (let i = 0; i < 10; i++) {
    numbers.push(i)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <ThemeToggle />
      <div className="pt-4 font-subhead text-3xl text-primary dark:text-accent">
        Plants to check on
      </div>
      <div className="py-4 text-sm">
        click and hold action buttons for more soil conditions
      </div>
      <div className="flex w-full flex-col gap-3 px-3 md:max-w-sm">
        <Plant name={`monstera`} imageUrl="/monstera-albo.jpeg" />
        {numbers.map((num) => (
          <Plant key={num} name={`plant ${num}`} />
        ))}
      </div>
    </div>
  )
}

export function Plant(props: { name: string; imageUrl?: string }) {
  return (
    <div className="flex flex-row items-center gap-4 rounded-xl border-3 border-destructive bg-grey p-2">
      <div
        className={cn(
          !props.imageUrl && "border border-primary",
          "h-16 w-16 overflow-hidden rounded-md"
        )}
      >
        {props.imageUrl ? (
          <Image
            src={props.imageUrl}
            alt={"monstera"}
            width={360}
            height={360}
          />
        ) : (
          <Sprout className="h-full w-full" />
        )}
      </div>
      <div className=" mr-2 flex grow flex-col gap-1 py-2">
        <div className=""> Plant {props.name}</div>
        <div className="opacity-70">
          <div>last water: 4 days ago</div>
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <Button selected={false} content={<Hand />} />
        <Button selected={true} content={<Droplet />} />
      </div>
    </div>
  )
}

export function Button(props: { selected: boolean; content: JSX.Element }) {
  return (
    <div
      className={cn(
        props.selected
          ? "bg-accent dark:border-primary dark:bg-border"
          : "border-accent bg-buttonBackground",
        "flex h-12 w-12 items-center justify-center rounded-full border-2"
      )}
    >
      {props.content}
    </div>
  )
}
