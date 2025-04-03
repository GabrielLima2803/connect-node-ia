import prisma from "../../../src/config/prisma/client";
import redis from "../../../src/config/redis/client";
import { getRanking } from "../../../src/usecases/ranking/get-ranking";


jest.mock("../../../src/config/prisma/client", () => ({
  subscription: {
    findMany: jest.fn(),
  },
}));

jest.mock("../../../src/config/redis/client", () => ({
  zrevrange: jest.fn(),
}));

describe("getRanking", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar o ranking dos top 3 usuários com suas pontuações", async () => {
    const mockRedisRanking = ["1", "10", "2", "8", "3", "5"];

    const mockSubscribers = [
      { id: "1", name: "User One", email: "user1@email.com" },
      { id: "2", name: "User Two", email: "user2@email.com" },
      { id: "3", name: "User Three", email: "user3@email.com" },
    ]; 

    (redis.zrevrange as jest.Mock).mockResolvedValue(mockRedisRanking);
    (prisma.subscription.findMany as jest.Mock).mockResolvedValue(mockSubscribers);

    const result = await getRanking();

    expect(redis.zrevrange).toHaveBeenCalledWith("referral:ranking", 0, 2, "WITHSCORES");
    expect(prisma.subscription.findMany).toHaveBeenCalledWith({
      where: { id: { in: ["1", "2", "3"] } },
    });

    expect(result).toEqual({
      rankingWithScores: [
        { id: "1", name: "User One", email: "user1@email.com", score: 10 },
        { id: "2", name: "User Two", email: "user2@email.com", score: 8 },
        { id: "3", name: "User Three", email: "user3@email.com", score: 5 },
      ],
    });
  });

  test("Deve retornar uma lista vazia se não houver ranking", async () => {
    (redis.zrevrange as jest.Mock).mockResolvedValue([]);
    (prisma.subscription.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getRanking();

    expect(redis.zrevrange).toHaveBeenCalledWith("referral:ranking", 0, 2, "WITHSCORES");
    expect(prisma.subscription.findMany).toHaveBeenCalledWith({
      where: { id: { in: [] } },
    });

    expect(result).toEqual({ rankingWithScores: [] });
  });

  test("Deve lançar um erro caso o Redis falhe", async () => {
    (redis.zrevrange as jest.Mock).mockRejectedValue(new Error("Erro no Redis"));

    await expect(getRanking()).rejects.toThrow("Erro no Redis");

    expect(redis.zrevrange).toHaveBeenCalledWith("referral:ranking", 0, 2, "WITHSCORES");
    expect(prisma.subscription.findMany).not.toHaveBeenCalled();
  });
});
