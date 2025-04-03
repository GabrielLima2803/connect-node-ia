import redis from "../../../src/config/redis/client";
import { getSubscriberInvitesCount } from "../../../src/usecases/subscriptions/get-subscriber-invites-count";

jest.mock("../../../src/config/redis/client", () => ({
  zscore: jest.fn(),
}));

describe("getSubscriberInvitesCount", () => {
  const mockSubscriberId = "user-123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar a contagem de convites corretamente", async () => {
    (redis.zscore as jest.Mock).mockResolvedValue("10");

    const result = await getSubscriberInvitesCount({ subscriberId: mockSubscriberId });

    expect(redis.zscore).toHaveBeenCalledWith("referral:ranking", mockSubscriberId);
    expect(result).toEqual({ count: 10 });
  });

  test("Deve retornar 0 quando não houver convites registrados", async () => {
    (redis.zscore as jest.Mock).mockResolvedValue(null);

    const result = await getSubscriberInvitesCount({ subscriberId: mockSubscriberId });

    expect(redis.zscore).toHaveBeenCalledWith("referral:ranking", mockSubscriberId);
    expect(result).toEqual({ count: 0 });
  });

  test("Deve lançar um erro se o Redis falhar", async () => {
    (redis.zscore as jest.Mock).mockRejectedValue(new Error("Falha no Redis"));

    await expect(getSubscriberInvitesCount({ subscriberId: mockSubscriberId })).rejects.toThrow("Falha no Redis");

    expect(redis.zscore).toHaveBeenCalledWith("referral:ranking", mockSubscriberId);
  });
});
