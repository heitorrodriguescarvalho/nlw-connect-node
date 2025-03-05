import { inArray } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

export default async function getRanking() {
  const rankingIdsAndScores = await redis.zrevrange(
    'referral:ranking',
    0,
    2,
    'WITHSCORES'
  )

  const subscribersIdAndScore: Record<string, number> = {}

  for (let i = 0; i < rankingIdsAndScores.length; i += 2) {
    subscribersIdAndScore[rankingIdsAndScores[i]] = Number.parseInt(
      rankingIdsAndScores[i + 1]
    )
  }

  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.id, Object.keys(subscribersIdAndScore)))

  const ranking = subscribers
    .map(subscriber => ({
      id: subscriber.id,
      name: subscriber.name,
      score: subscribersIdAndScore[subscriber.id],
    }))
    .sort((sub1, sub2) => sub2.score - sub1.score)

  return { ranking }
}
