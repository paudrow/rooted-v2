import dayjs from "dayjs"

export function getDaysBetweenDates(...dates: Date[]): number[] {
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime())
  const daysBetweenDates = []
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = dayjs(sortedDates[i + 1]).diff(sortedDates[i], "day")
    daysBetweenDates.push(diff)
  }
  return daysBetweenDates
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