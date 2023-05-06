/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { WaterEventType } from "@prisma/client"

import {
  daysUntilWatering,
  getAdjustedDaysBetweenWatering,
  getDateOfNextWatering,
  getDaysBetweenDates,
  type _WaterEvent,
} from "./watering-algorithm"

describe("daysUntilWatering", () => {
  it("returns 7", () => {
    expect(daysUntilWatering()).toEqual(7)
  })
})

describe("getDaysBetweenDates", () => {
  it.each([
    {
      dateStrings: [],
      expected: [],
    },
    {
      dateStrings: ["2021-01-01"],
      expected: [],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-01"],
      expected: [0],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-02"],
      expected: [1],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-02", "2021-01-03"],
      expected: [1, 1],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-06"],
      expected: [1, 1, 3],
    },
  ])("%j", ({ dateStrings, expected }) => {
    const dates = dateStrings.map(
      (dateString) => new Date(Date.parse(dateString))
    )
    expect(getDaysBetweenDates(...dates)).toEqual(expected)
  })
})

describe("getAdjustedDaysBetweenWatering", () => {
  it.each([
    {
      dateStrings: [],
    },
    {
      dateStrings: ["2021-01-01"],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-02"],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-02", "2021-01-03"],
    },
    {
      dateStrings: ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-06"],
    },
  ])("%#. %j", ({ dateStrings }) => {
    let lastSum: number | undefined = undefined
    for (let i = 0; i < dateStrings.length; i++) {
      const waterEvents: _WaterEvent[] = []
      for (let j = 0; j < dateStrings.length; j++) {
        const date = new Date(Date.parse(dateStrings[j]!))
        const type =
          j > i ? WaterEventType.WATERED : WaterEventType.WATERED_TOO_DRY
        waterEvents.push({ date, type })
      }
      const adjustedDaysBetweenWatering =
        getAdjustedDaysBetweenWatering(waterEvents)
      const actualSum = adjustedDaysBetweenWatering.reduce((a, b) => a + b, 0)
      if (lastSum !== undefined) {
        expect(actualSum).toBeLessThanOrEqual(lastSum)
      }
      lastSum = actualSum
    }
  })
})

describe("getDateOfNextWatering", () => {
  it("works for a simple case - median should be 1", () => {
    const date = getDateOfNextWatering([
      {
        date: new Date(Date.parse("2021-01-01")),
        type: WaterEventType.WATERED,
      },
      {
        date: new Date(Date.parse("2021-01-02")),
        type: WaterEventType.WATERED,
      },
      {
        date: new Date(Date.parse("2021-01-03")),
        type: WaterEventType.WATERED,
      },
      {
        date: new Date(Date.parse("2021-01-06")),
        type: WaterEventType.WATERED_TOO_DRY,
      },
    ])
    expect(date).toEqual(new Date(Date.parse("2021-01-07")))
  })

  it("works for a simple case - median should be 2", () => {
    const date = getDateOfNextWatering([
      {
        date: new Date(Date.parse("2021-01-01")),
        type: WaterEventType.WATERED,
      },
      {
        date: new Date(Date.parse("2021-01-02")),
        type: WaterEventType.WATERED,
      },
      {
        date: new Date(Date.parse("2021-01-03")),
        type: WaterEventType.WATERED,
      },
      {
        date: new Date(Date.parse("2021-01-06")),
        type: WaterEventType.WATERED_TOO_DRY,
      },
      {
        date: new Date(Date.parse("2021-01-07")),
        type: WaterEventType.WATERED_TOO_DRY,
      },
    ])
    expect(date).toEqual(new Date(Date.parse("2021-01-08")))
  })
})
