import { getDateOfNextWaterCheck } from "@/controller/watering-algorithm"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { type WaterEvent } from "@prisma/client"
import { z } from "zod"

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
  getAll: privateProcedure.query(({ ctx }) => {
    if (!ctx.userId) {
      throw new Error("User is not authenticated")
    }
    return ctx.prisma.plant.findMany({
      where: {
        userId: ctx.userId,
      },
    })
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
      })
      if (!plant) {
        throw new Error("Plant not found")
      }
      const onlyWaterEvents = await ctx.prisma.waterEvent.findMany({
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
        take: 5,
      })

      const lastEvent = await ctx.prisma.waterEvent.findFirst({
        where: {
          plantId: input.id,
        },
        orderBy: {
          date: "desc",
        },
      })

      let events: WaterEvent[] = []
      if (!lastEvent) {
        events = onlyWaterEvents
      } else {
        events = [
          ...(onlyWaterEvents[0]?.id === lastEvent?.id ? [] : [lastEvent]),
          ...onlyWaterEvents,
        ]
      }

      console.log(events.map((e) => e.date))

      return {
        ...plant,
        lastWaterDate: events[0]?.date,
        nextCheckDate: getDateOfNextWaterCheck(events),
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
