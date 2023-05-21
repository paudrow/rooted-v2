import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { WaterEventType } from "@prisma/client"
import { z } from "zod"

export const eventRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        plantId: z.string(),
        date: z.date(),
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
  updateById: privateProcedure
    .input(
      z.object({
        id: z.string(),
        plantId: z.string(),
        date: z.date(),
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
      include: {
        plant: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        date: "desc",
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
        include: {
          plant: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      })
    }),
  getById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.waterEvent.findUnique({
        where: {
          id: input.id,
        },
        include: {
          plant: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
      })
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
      await ctx.prisma.waterEvent.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
