import { getDateOfNextWaterCheck } from "@/controller/watering-algorithm"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { type Plant, type WaterEvent } from "@prisma/client"
import dayjs from "dayjs"
import { z } from "zod"

function getNextAndLastWaterDates(data: Plant & { WaterEvent: WaterEvent[] }) {
  return {
    lastWaterDate: data.WaterEvent.find(
      (event) => event.type === "WATERED" || event.type === "WATERED_TOO_DRY"
    )?.date,
    nextWaterDate: getDateOfNextWaterCheck(data.WaterEvent, 10),
  }
}

export const plantRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.plant.create({
        data: {
          name: input.name,
          userId: ctx.userId,
          imageUrl: input.imageUrl,
        },
      })
    }),
  updateById: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.plant.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          userId: ctx.userId,
          imageUrl: input.imageUrl,
        },
      })
    }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new Error("User is not authenticated")
    }
    const plants = await ctx.prisma.plant.findMany({
      where: {
        userId: ctx.userId,
      },
      include: {
        WaterEvent: {
          take: 50,
          orderBy: {
            date: "desc",
          },
        },
      },
    })
    const plantsWithWaterDates = plants
      .map((plant) => {
        const { lastWaterDate, nextWaterDate } = getNextAndLastWaterDates(plant)
        return {
          ...plant,
          lastWaterDate,
          nextWaterDate,
        }
      })
      .sort((a, b) => {
        if (a.nextWaterDate < b.nextWaterDate) {
          return -1
        }
        if (a.nextWaterDate > b.nextWaterDate) {
          return 1
        }
        return 0
      })
    const endOfCurrentDay = dayjs().endOf("day").toDate()
    return {
      due: plantsWithWaterDates.filter(
        (plant) => plant.nextWaterDate <= endOfCurrentDay
      ),
      notDue: plantsWithWaterDates.filter(
        (plant) => plant.nextWaterDate > endOfCurrentDay
      ),
    }
  }),
  getById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      const plant = await ctx.prisma.plant.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        include: {
          WaterEvent: {
            where: {
              AND: [
                {
                  plantId: input.id,
                },
                {
                  OR: [
                    {
                      type: "WATERED",
                    },
                    {
                      type: "WATERED_TOO_DRY",
                    },
                  ],
                },
              ],
            },
            orderBy: {
              date: "desc",
            },
            take: 50,
          },
        },
      })

      if (!plant) {
        throw new Error("Plant not found")
      }

      const { lastWaterDate, nextWaterDate } = getNextAndLastWaterDates(plant)

      return {
        ...plant,
        lastWaterDate,
        nextWaterDate,
      }
    }),
  deleteById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      await ctx.prisma.waterEvent.deleteMany({
        where: {
          plantId: input.id,
        },
      })
      await ctx.prisma.plant.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
