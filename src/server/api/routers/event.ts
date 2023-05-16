import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { z } from "zod"
import { WaterEventType } from "@prisma/client"

export const eventRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({  
        plantId: z.string(),
        date: z.string(),
        type: z.nativeEnum(WaterEventType),
        note: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.waterEvent.create({
        data: {
          plantId: input.plantId,
          date: input.date,
          userId: ctx.userId,
          type: input.type,
          note: input.note,
        },
      })
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        plantId: z.string(),
        date: z.string(),
        type: z.nativeEnum(WaterEventType),
        note: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.waterEvent.update({
        where: {
          id: input.id,
        },
        data: {
          plantId: input.plantId,
          date: input.date,
          userId: ctx.userId,
          type: input.type,
          note: input.note,
        },
      })
    }),
  getAll: privateProcedure.query(({ ctx }) => {
    if (!ctx.userId) {
      throw new Error("User is not authenticated")
    }
    return ctx.prisma.waterEvent.findMany({
      where: {
        userId: ctx.userId,
      },
    })
  }),
  getAllForPlant: privateProcedure
    .input(
      z.object({
        plantId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.waterEvent.findMany({
        where: {
          AND: [
            {
              plantId: input.plantId,
            },
            {
              userId: ctx.userId,
            },
          ],
        },
      })
    }),
})
