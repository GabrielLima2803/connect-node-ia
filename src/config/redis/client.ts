import { Redis } from 'ioredis'
import { env } from '../dotenv/env'

const redis = new Redis(env.REDIS_URL)

export default redis;