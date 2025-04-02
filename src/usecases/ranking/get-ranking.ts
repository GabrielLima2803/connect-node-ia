import prisma from "../../config/prisma/client.";
import redis from "../../config/redis/client.";


export async function getRanking() {
    const topThree = await redis.zrevrange('referral:ranking', 0, 2, 'WITHSCORES')
    const ranking: Record<string, number> = {}

    for (let i = 0; i < topThree.length; i += 2) {
        ranking[topThree[i]] = Number.parseInt(topThree[i + 1])
    }

    const subscribersFromRanking = await prisma.subscription.findMany({
        where: {
          id: {
            in: Object.keys(ranking)
          }
        }
      });

    const rankingWithScores = subscribersFromRanking.map(subscriber => {
        return {
            ...subscriber,
            score: ranking[subscriber.id]
        }
    })
    .sort((a, b) => b.score - a.score)

    return { rankingWithScores }
}