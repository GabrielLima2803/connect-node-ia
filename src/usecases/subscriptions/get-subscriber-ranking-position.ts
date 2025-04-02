import redis from "../../config/redis/client."
import SubscriberParamsDto from "../../dtos/subscriberParams-request.dto"

export async function getSubscriberRankingPosition({
    subscriberId,
  }: SubscriberParamsDto) {
    const rank = await redis.zrevrank('referral:ranking', subscriberId)
  
    if (rank === null) {
      return { position: null }
    }
  
    const position = rank + 1
  
    return { position }
  }