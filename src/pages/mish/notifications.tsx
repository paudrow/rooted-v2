import { useState } from "react"
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

export default function Notifications() {
  const numbers: number[] = []
  for (let i = 0; i < 4; i++) {
    numbers.push(i)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <ThemeToggle />
      <div className="font-subhead text-3xl text-primary dark:text-accent">
        Plants to check on
      </div>
      <div className="text-sm">
        click and hold action buttons for more soil conditions
      </div>
      <div className="flex w-full flex-col gap-3 px-3 md:max-w-sm">
        <Plant
          name={`monstera`}
          imageUrl="/monstera-albo.jpeg"
          completed={false}
        />
        {numbers.map((num) => (
          <Plant key={num} name={`plant ${num}`} completed={false} />
        ))}
      </div>
      <div />
      <MarkAllButton />
      <div />
      <div className="font-subhead text-lg">Completed</div>
      <div className="flex w-full flex-col gap-3 px-3 md:max-w-sm">
        <Plant
          name={`monstera`}
          imageUrl="/monstera-albo.jpeg"
          completed={true}
        />
        {numbers.map((num) => (
          <Plant key={num} name={`plant ${num}`} completed={true} />
        ))}
      </div>
    </div>
  )
}

export function Plant(props: {
  name: string
  imageUrl?: string
  completed: boolean
}) {
  return (
    <div
      className={cn(
        props.completed ? "border-border" : "border-destructive",
        "flex flex-row items-center gap-4 rounded-xl border-3  bg-grey p-2"
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
        <div className="opacity-70">
          <div>last water: 4 days ago</div>
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <Button isSelectedInitially={false} content={<Hand />} />
        <Button isSelectedInitially={true} content={<MyDroplet />} />
      </div>
    </div>
  )
}

export function Button(props: {
  isSelectedInitially: boolean
  content: JSX.Element
}) {
  const [selected, setSelected] = useState(props.isSelectedInitially)
  return (
    <div
      onClick={() => setSelected(!selected)}
      className={cn(
        selected
          ? "bg-accent dark:border-primary dark:bg-border"
          : "border-border bg-buttonBackground",
        "flex h-12 w-12 items-center justify-center rounded-full border-2"
      )}
    >
      {props.content}
    </div>
  )
}

export function MarkAllButton() {
  return (
    <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border-3 border-border bg-buttonBackground">
      <MyDroplet className="h-10 w-10" />
      <p>for all</p>
    </div>
  )
}

export function MyDroplet(props: { className?: string }) {
  return <Droplet className={cn("text-teal-300", props.className)} />
}
