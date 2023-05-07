import { WaterEventType } from "@prisma/client"
import dayjs from "dayjs"

import {
  TOO_DRY_DAYS_BETWEEN_SCALER,
  TOO_WET_DAYS_TO_ADD_SCALER,
  _getDaysFromLastEventToNextWatering,
  getDateOfNextWateringEvent,
} from "./watering-algorithm"

describe("getDateOfNextWateringEvent", () => {
  it("returns today with no events", () => {
    expect(getDateOfNextWateringEvent([]).toDateString()).toEqual(
      new Date().toDateString()
    )
  })

  it("returns today with one event", () => {
    const dayjsDate = dayjs(new Date())
    expect(
      getDateOfNextWateringEvent([
        {
          date: dayjsDate.toDate(),
          type: WaterEventType.WATERED,
        },
      ])
    ).toEqual(dayjsDate.add(1, "day").toDate())
  })

  it("returns the median time between with two watering events", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        getDateOfNextWateringEvent([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toEqual(dayjsDate.add(2 * i, "day").toDate())
    }
  })

  it("returns the median time between with three watering events", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        getDateOfNextWateringEvent([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(2 * i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toEqual(dayjsDate.add(3 * i, "day").toDate())
    }
  })

  it("adds one day with a last snoozed event", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        getDateOfNextWateringEvent([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(2 * i, "day").toDate(),
            type: WaterEventType.SKIPPED_SNOOZED,
          },
        ])
      ).toEqual(dayjsDate.add(2 * i + 1, "day").toDate())
    }
  })
})

describe("_getDaysFromLastEventToNextWatering", () => {
  it("returns 0 with no events", () => {
    expect(_getDaysFromLastEventToNextWatering([])).toEqual(0)
  })

  it("returns 1 with no watering events", () => {
    for (const type of [
      WaterEventType.SKIPPED_SNOOZED,
      WaterEventType.SKIPPED_TOO_WET,
    ]) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: new Date(),
            type,
          },
        ])
      ).toEqual(1)
    }
  })

  it("returns 1 with one watering event", () => {
    expect(
      _getDaysFromLastEventToNextWatering([
        {
          date: new Date(),
          type: WaterEventType.WATERED,
        },
      ])
    ).toEqual(1)
  })

  it("returns the time between with two watering events", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toEqual(i)
    }
  })

  it("returns the median time between with three watering events", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toEqual(i)
    }
  })

  it("returns the median time between with four watering events", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 2; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(), // day 0
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i - 1, "day").toDate(), // make 1 less than `i`
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2 - 1, "day").toDate(), // keep offset
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(), // remove offset so median is `i`
            type: WaterEventType.WATERED,
          },
        ])
      ).toEqual(i)
    }
  })

  it("ignores skip events that are not the last event", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 2; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.SKIPPED_SNOOZED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.SKIPPED_SNOOZED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 3 - 1, "day").toDate(),
            type: WaterEventType.SKIPPED_TOO_WET,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toEqual(i)
    }
  })

  it("decreases the time with the last event being too dry", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
        ])
      ).toBeCloseTo(i * TOO_DRY_DAYS_BETWEEN_SCALER)
    }
  })

  it("uses intermediate too dry events in the median", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      // 1 too dry event, which isn't selected as the median
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toBeCloseTo(i)

      // 2 too dry events, which are selected as the median
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.WATERED,
          },
        ])
      ).toBeCloseTo(i * TOO_DRY_DAYS_BETWEEN_SCALER)

      // 2 intermediate too dry events + an end too dry event resulting in the dry constant being applied twice
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.WATERED_TOO_DRY,
          },
        ])
      ).toBeCloseTo(i * (TOO_DRY_DAYS_BETWEEN_SCALER ** 2))
    }
  })

  it("increases the time with the last event being too wet", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.SKIPPED_TOO_WET,
          },
        ])
      ).toBeCloseTo(i * TOO_WET_DAYS_TO_ADD_SCALER)
    }
  })

  it("adds one day for snoozed events", () => {
    const dayjsDate = dayjs(new Date())
    for (let i = 1; i < 10; i = i + 2) {
      expect(
        _getDaysFromLastEventToNextWatering([
          {
            date: dayjsDate.toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 2, "day").toDate(),
            type: WaterEventType.WATERED,
          },
          {
            date: dayjsDate.add(i * 3, "day").toDate(),
            type: WaterEventType.SKIPPED_SNOOZED,
          },
        ])
      ).toEqual(1)
    }
  })
})
