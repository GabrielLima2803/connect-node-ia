import redis from "../../config/redis/client."
import SubscriberParamsDto from "../../dtos/subscriberParams-request.dto"

export async function getSubscriberInvitesCount({ subscriberId }: SubscriberParamsDto) {
    const invitesCount = await redis.zscore('referral:ranking', subscriberId)
  
    return { count: invitesCount ? Number.parseInt(invitesCount) : 0 }
  }