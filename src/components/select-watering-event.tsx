import { WaterEventType } from "@prisma/client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectWateringEvent(props: {
  onValueChange: (value: string) => void
  startingValue?: string
}) {
  return (
    <Select onValueChange={props.onValueChange} value={props.startingValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an event type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Water events</SelectLabel>
          {Object.values(WaterEventType).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
