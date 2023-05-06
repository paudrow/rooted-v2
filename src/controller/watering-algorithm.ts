/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { WaterEventType, type WaterEvent } from "@prisma/client"
import dayjs from "dayjs"
import { median } from "mathjs"

const TOO_WET_DAYS_TO_ADD_SCALER = 1 / 3
const TOO_DRY_DAYS_BETWEEN_SCALER = 2 / 3

export type _WaterEvent = Pick<WaterEvent, "date" | "type">

export function getDaysBetweenDates(...dates: Date[]): number[] {
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime())
  const daysBetweenDates = []
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = dayjs(sortedDates[i + 1]).diff(sortedDates[i], "day")
    daysBetweenDates.push(diff)
  }
  return daysBetweenDates
}

export function getAdjustedDaysBetweenWatering(
  events: _WaterEvent[]
): number[] {
  const sortedEvents = events
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter(isWateringEvent)

  const daysBetweenDates = getDaysBetweenDates(
    ...sortedEvents.map((event) => event.date)
  )
  const adjustedDaysBetweenWatering: number[] = []
  for (let i = 0; i < daysBetweenDates.length; i++) {
    const days = daysBetweenDates[i]!
    const { type: eventType } = sortedEvents[i]!
    if (eventType === WaterEventType.WATERED) {
      adjustedDaysBetweenWatering.push(days)
    } else if (eventType === WaterEventType.WATERED_TOO_DRY) {
      adjustedDaysBetweenWatering.push(days * TOO_DRY_DAYS_BETWEEN_SCALER)
    } else {
      throw new Error(`Invalid event type: ${eventType}`)
    }
  }
  return adjustedDaysBetweenWatering
}

function isWateringEvent(event: _WaterEvent): boolean {
  return (
    event.type === WaterEventType.WATERED ||
    event.type === WaterEventType.WATERED_TOO_DRY
  )
}

export function getDateOfNextWatering(events: _WaterEvent[]): Date {
  const sortedEvents = events.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )

  const medianDaysBetweenWatering = median(
    getAdjustedDaysBetweenWatering(sortedEvents)
  ) as number

  const wateringEvents = sortedEvents.filter(isWateringEvent)
  if (wateringEvents.length < 2) {
    throw new Error("Not enough watering events")
  }
  const lastWateringDate = wateringEvents[wateringEvents.length - 1]!.date

  const lastEvent = sortedEvents[sortedEvents.length - 1]!
  let nextWateringDate = dayjs(lastWateringDate).add(
    medianDaysBetweenWatering,
    "day"
  )
  let potentialNextWateringDate: dayjs.Dayjs | null = null
  if (lastEvent.type === WaterEventType.SKIPPED_TOO_WET) {
    potentialNextWateringDate = dayjs(lastEvent.date).add(
      medianDaysBetweenWatering * TOO_WET_DAYS_TO_ADD_SCALER,
      "day"
    )
  } else if (lastEvent.type === WaterEventType.SKIPPED_SNOOZED) {
    potentialNextWateringDate = dayjs(lastEvent.date).add(1, "day")
  }
  if (
    potentialNextWateringDate !== null &&
    potentialNextWateringDate.isAfter(nextWateringDate)
  ) {
    nextWateringDate = potentialNextWateringDate
  }

  return nextWateringDate.toDate()
}

export function daysUntilWatering() {
  return 7
}

if (require.main === module) {
  const dates: Date[] = [
    new Date(Date.parse("2021-01-01")),
    new Date(Date.parse("2021-01-02")),
    new Date(Date.parse("2021-01-03")),
    new Date(Date.parse("2021-01-04")),
    new Date(Date.parse("2021-01-06")),
  ]

  console.log(getDaysBetweenDates(...dates))
}
