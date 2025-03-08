import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import getRanking from '../functions/get-ranking'

export const getRankingRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/ranking',
    {
      schema: {
        summary: 'Get the 3 most referred users in the ranking',
        operationId: 'getRanking',
        tags: ['referral'],
        response: {
          200: z.object({
            ranking: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                score: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (req, res) => {
      const { ranking } = await getRanking()

      return res.status(200).send({ ranking })
    }
  )
}
