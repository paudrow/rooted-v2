import { format } from "date-fns"
import dayjs from "dayjs"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PickDatePopover(props: {
  setDate: (date: Date) => void
  date: Date | undefined
  isTodayOrEarlier?: boolean
  startingDate?: Date
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !props.date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.date ? format(props.date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={(date) => {
            if (date) props.setDate(date)
          }}
          initialFocus
          toDate={
            props.isTodayOrEarlier
              ? dayjs().hour(23).minute(59).second(59).toDate()
              : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )
}
