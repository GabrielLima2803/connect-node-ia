import redis from "../../../src/config/redis/client";
import { getSubscriberRankingPosition } from "../../../src/usecases/subscriptions/get-subscriber-ranking-position";

jest.mock("../../../src/config/redis/client", () => ({
  zrevrank: jest.fn(),
}));

describe("getSubscriberRankingPosition", () => {
  const mockSubscriberId = "user-123";

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("Deve retornar a posição correta do ranking", async () => {
    (redis.zrevrank as jest.Mock).mockResolvedValue(4);

    const result = await getSubscriberRankingPosition({ subscriberId: mockSubscriberId });

    expect(redis.zrevrank).toHaveBeenCalledWith("referral:ranking", mockSubscriberId);
    expect(result).toEqual({ position: 5 });
  });

  test("Deve retornar null quando o usuário não estiver no ranking", async () => {
    (redis.zrevrank as jest.Mock).mockResolvedValue(null);

    const result = await getSubscriberRankingPosition({ subscriberId: mockSubscriberId });

    expect(redis.zrevrank).toHaveBeenCalledWith("referral:ranking", mockSubscriberId);
    expect(result).toEqual({ position: null });
  });

  test("Deve lançar um erro se o Redis falhar", async () => {
    (redis.zrevrank as jest.Mock).mockRejectedValue(new Error("Falha no Redis"));

    await expect(getSubscriberRankingPosition({ subscriberId: mockSubscriberId })).rejects.toThrow("Falha no Redis");

    expect(redis.zrevrank).toHaveBeenCalledWith("referral:ranking", mockSubscriberId);
  });
});
