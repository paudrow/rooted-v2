import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { z } from "zod"

export const eventRouter = createTRPCRouter({
  getForPlant: privateProcedure
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
