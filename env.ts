import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  WEB_URL: z.string().url(),
  CORS_ORIGIN: z
    .string()
    .transform(value => value.split(',').map(value => value.trim()))
    .refine(
      values =>
        values.every(value => z.string().url().safeParse(value).success),
      'CORS_ORIGIN must be a comma-separated list of valid URLs'
    ),
  POSTGRES_URL: z.string().url(),
  REDIS_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
