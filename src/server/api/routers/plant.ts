import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { z } from "zod"

export const plantRouter = createTRPCRouter({
  getForUser: privateProcedure.query(({ ctx }) => {
    if (!ctx.userId) {
      throw new Error("User is not authenticated")
    }
    return ctx.prisma.plant.findMany({
      where: {
        userId: ctx.userId,
      },
    })
  }),
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
})
