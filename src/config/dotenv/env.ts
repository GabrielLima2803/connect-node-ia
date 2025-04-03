import {z} from "zod";

const envScheme = z.object({
    PORT: z.coerce.number().default(3000),
    REDIS_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
})

export const env = envScheme.parse(process.env)