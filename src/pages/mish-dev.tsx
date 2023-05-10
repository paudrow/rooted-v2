import MishComponent from "@/components/mish-component"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

export default function MishDev() {
  return (
    <div>
      <MishComponent />
      <MishComponent2 />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger><span className="font-header">secret</span></TooltipTrigger>
          <TooltipContent>
            <p>hi</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ThemeToggle />
    </div>
  )
}

export function MishComponent2() {
  return (
    <><div>
      <h1 className="text-xl"> catamaran </h1>
    </div>

    </>
  )
}