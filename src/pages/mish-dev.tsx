import MishComponent from "@/components/mish-component"
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
          <TooltipTrigger><span className="text-blue-700">secret</span></TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function MishComponent2() {
  return (
    <div>
      <h1 className="text-xl text-red-900"> hi </h1>
    </div>
  )
}