import { daysUntilWatering, getDaysBetweenDates } from "./watering-algorithm"

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