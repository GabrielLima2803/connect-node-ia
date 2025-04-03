import prisma from "../../config/prisma/client";
import redis from "../../config/redis/client";
import SubscriptionRequestDto from "../../dtos/subscription-request.dto";

export async function subscribeToEvent({
    name,
    email,
    invitedBySubscriberId,
  }: SubscriptionRequestDto) {
    const existingSubscriber = await prisma.subscription.findUnique({
      where: { email },
    });
  
    if (existingSubscriber) {
      return { subscriberId: existingSubscriber.id };
    }
  
    const newSubscriber = await prisma.subscription.create({
      data: {
        name,
        email,
      },
    });
  
    if (invitedBySubscriberId) {
      await redis.zincrby('referral:ranking', 1, invitedBySubscriberId);
    }
  
    return { subscriberId: newSubscriber.id };
  }