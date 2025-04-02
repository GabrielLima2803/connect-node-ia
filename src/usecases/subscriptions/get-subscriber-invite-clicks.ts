import redis from "../../config/redis/client."
import SubscriberParamsDto from "../../dtos/subscriberParams-request.dto"
export async function getSubscriberInvitesClicks({
    subscriberId,
  }: SubscriberParamsDto) {
    const accessCount = await redis.hget('referral:access-count', subscriberId)
  
    return { count: accessCount ? Number.parseInt(accessCount) : 0 }
  }