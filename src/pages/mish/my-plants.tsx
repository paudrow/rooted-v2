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

export default function MyPlants() {

  const numbers: number[] = []
  for (let i = 0; i < 10; i++) {
    numbers.push(i)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="text-3xl font-header p-4 uppercase">
        My Plants
      </div>
      <div className="m-2 w-96">
        <SearchBar />
      </div>
      <div className="flex flex-col gap-3 w-96">
        {numbers.map((num) => (
          <Plant key={num} selected={num === 1} name={`plant ${num}`} />
        ))}
      </div>
    </div>
  )
}

export function Plant(props: { selected: boolean, name: string }) {
  return (
    <>
      <div className={cn(props.selected && 'border-destructive', 'border-2 rounded-lg border-accent p-2')}>
        <p className="text-xl">{props.name}</p>
        <div className="flex justify-evenly">
          <div className="text-sm">
            average water: 6 days
          </div>
          <div className="text-sm">
            last water: 6 days
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