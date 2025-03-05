import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

interface SubscribeToEventParams {
  name: string
  email: string
  referrerId?: string | null
}

export async function subscribeToEvent({
  name,
  email,
  referrerId,
}: SubscribeToEventParams) {
  const existingSubscribers = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (existingSubscribers.length > 0) {
    return { subscriberId: existingSubscribers[0].id }
  }

  const [subscriber] = await db
    .insert(subscriptions)
    .values({ name, email })
    .returning()

  if (referrerId) {
    await redis.zincrby('referral:ranking', 1, referrerId)
  }

  return { subscriberId: subscriber.id }
}
