import Image from "next/image"
import { Sprout } from "lucide-react"

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
      <div className="pt-4 font-header text-3xl uppercase text-primary dark:text-accent">
        My Plants
      </div>
      <div className="w-96 py-6">
        <SearchBar />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Plant
          selected={true}
          name={`monstera`}
          imageUrl="/monstera-albo.jpeg"
        />
        {numbers.map((num) => (
          <Plant key={num} selected={num === 1} name={`plant ${num}`} />
        ))}
      </div>
    </div>
  )
}

export function Plant(props: {
  selected: boolean
  name: string
  imageUrl?: string
}) {
  return (
    <>
      <div
        className={cn(
          props.selected ? "border-destructive" : "border-accent",
          "flex flex-row items-center gap-4 rounded-xl border-3 bg-grey p-2"
        )}
      >
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
          <div className="flex flex-row justify-between opacity-70">
            <div>avg water: 6 days</div>
            <div>last water: 4 days ago</div>
          </div>
        </div>
      </div>
    </>
  )
}

export function SearchBar() {
  return (
    <Command className="rounded-lg border border-primary shadow-md">
      <CommandInput placeholder="Search my plants..." />
    </Command>
  )
}
