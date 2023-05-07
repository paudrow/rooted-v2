import { WaterEventType, type WaterEvent } from "@prisma/client";
import dayjs from "dayjs";
import { median } from "mathjs";





export const TOO_WET_DAYS_TO_ADD_SCALER = 1 / 3
export const TOO_DRY_DAYS_BETWEEN_SCALER = 2 / 3

export type _WaterEvent = Pick<WaterEvent, "date" | "type">

export function getDateOfNextWateringEvent(
  events: _WaterEvent[],
): Date {
  if (events.length === 0) {
    return new Date()
  }
  const lastEvent = events[events.length - 1]!
  const daysFromLastEventToNextWatering = _getDaysFromLastEventToNextWatering(
    events,
  )
  const dateOfNextWatering = dayjs(lastEvent.date).add(
    daysFromLastEventToNextWatering,
    "day",
  )
  return dateOfNextWatering.toDate()
}

export function _getDaysFromLastEventToNextWatering(
  events: _WaterEvent[],
): number {
  if (events.length === 0) {
    return 0
  }

  const wateringEvents = events.filter((event) => _isWateringEvent(event.type))
  if (wateringEvents.length < 2) {
    return 1
  }
  const medianDaysBeforeWatering = _getMedianDaysBeforeWatering(wateringEvents)

  const lastEvent = events[events.length - 1]!
  switch (lastEvent.type) {
    case WaterEventType.WATERED:
      return medianDaysBeforeWatering
    case WaterEventType.SKIPPED_TOO_WET:
      return medianDaysBeforeWatering * TOO_WET_DAYS_TO_ADD_SCALER
    case WaterEventType.SKIPPED_SNOOZED:
      return 1
    case WaterEventType.WATERED_TOO_DRY:
      return medianDaysBeforeWatering * TOO_DRY_DAYS_BETWEEN_SCALER
  }
}

export function _getMedianDaysBeforeWatering(
  wateringEvents: _WaterEvent[]
): number {
  const sortedEvents = wateringEvents
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const events = sortedEvents.map((event) => event.type)
  const dates = sortedEvents.map((event) => event.date)

  const daysBetweenDates = _getDaysBetweenDates(...dates)
  const medianDaysBeforeWatering = _getMedianDaysBeforeWateringHelper(
    daysBetweenDates,
    events.slice(1),
  )
  return medianDaysBeforeWatering
}

export function _getMedianDaysBeforeWateringHelper(
  daysBetween: number[],
  eventTypes: WaterEventType[]
): number {
  if (daysBetween.length !== eventTypes.length) {
    throw new Error(
      `Must have the same number of days between and event types. Days between: ${daysBetween.length} Event types: ${eventTypes.length}`
    )
  }
  if (daysBetween.length === 0) {
    throw new Error("Must have at least one day between")
  }
  const scaledDaysBetween: number[] = []
  for (let i = 0; i < daysBetween.length; i++) {
    const days = daysBetween[i]!
    const eventType = eventTypes[i]!
    if (!_isWateringEvent(eventType)) {
      throw new Error(`Must be a water event, not a skip: ${eventType}`)
    }
    const scaledDays = _scaleDaysBetweenForAnEvent(days, eventType)
    scaledDaysBetween.push(scaledDays)
  }
  return median(scaledDaysBetween) as number
}

export function _scaleDaysBetweenForAnEvent(
  daysBetween: number,
  eventType: WaterEventType
): number {
  if (eventType === WaterEventType.WATERED) {
    return daysBetween
  } else if (eventType === WaterEventType.WATERED_TOO_DRY) {
    return daysBetween * TOO_DRY_DAYS_BETWEEN_SCALER
  } else {
    throw new Error(`Must be a water event, not a skip: ${eventType}`)
  }
}

function _isWateringEvent(eventType: WaterEventType): boolean {
  return (
    eventType === WaterEventType.WATERED ||
    eventType === WaterEventType.WATERED_TOO_DRY
  )
}

export function _getDaysBetweenDates(...dates: Date[]): number[] {
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime())
  const daysBetweenDates = []
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = dayjs(sortedDates[i + 1]).diff(sortedDates[i], "day")
    daysBetweenDates.push(diff)
  }
  return daysBetweenDates
}


if (require.main === module) {
  const out = _getDaysFromLastEventToNextWatering([
    {
      date: new Date("2021-01-01"),
      type: WaterEventType.WATERED
    },
    {
      date: new Date("2021-01-04"),
      type: WaterEventType.WATERED
    },
    {
      date: new Date("2021-01-07"),
      type: WaterEventType.WATERED
    },
    {
      date: new Date("2021-01-09"),
      type: WaterEventType.SKIPPED_SNOOZED
    },
  ])
  console.log(out)
}