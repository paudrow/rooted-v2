import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
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
    .query(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.plant.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      })
    }),
  deleteById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error("User is not authenticated")
      }
      return ctx.prisma.plant.delete({
        where: {
          id: input.id,
        },
        include: {
          WaterEvent: true,
        },
      })
    }),
})
