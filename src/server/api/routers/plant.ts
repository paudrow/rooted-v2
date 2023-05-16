import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { z } from "zod"

export const plantRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
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
        },
      })
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
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
})
