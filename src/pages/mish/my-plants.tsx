import MishComponent from "@/components/mish-component"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,

} from "@/components/ui/command"
import { Sprout } from "lucide-react"
import Image from "next/image"

export default function MyPlants() {

  const numbers: number[] = []
  for (let i = 0; i < 10; i++) {
    numbers.push(i)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <ThemeToggle />
      <div className="text-3xl font-header p-4 uppercase">
        My Plants
      </div>
      <div className="m-2 w-96">
        <SearchBar />
      </div>
      <div className="flex flex-col gap-3 max-w-sm w-full">
        <Plant selected={true} name={`monstera`} imageUrl="/monstera-albo.jpeg" />
        {numbers.map((num) => (
          <Plant key={num} selected={num === 1} name={`plant ${num}`} />
        ))}
      </div>
    </div>
  )
}

export function Plant(props: { selected: boolean, name: string, imageUrl?: string }) {
  return (
    <>
      <div className={cn(props.selected ? 'border-destructive' : "border-accent", 'flex flex-row items-center border-3 bg-grey rounded-xl p-2 gap-4')}>
        <div className={cn(!props.imageUrl && 'border border-primary', 'w-16 h-16 rounded-md overflow-hidden')}>
          {props.imageUrl ? <Image src={props.imageUrl} alt={"monstera"} width={360} height={360}/>:
          <Sprout className="w-full h-full" />}
        </div>
        <div className=" grow flex flex-col py-2 mr-2 gap-1">
          <div className=""> Plant {props.name}</div>
          <div className="flex flex-row justify-between text-sm">
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