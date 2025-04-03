import redis from "../../../src/config/redis/client";
import { getSubscriberInvitesClicks } from "../../../src/usecases/subscriptions/get-subscriber-invite-clicks";


jest.mock("../../../src/config/redis/client", () => ({
  hget: jest.fn(),
}));

describe("getSubscriberInvitesClicks", () => {
  const mockSubscriberId = "user-123";

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("Deve retornar a contagem de acessos corretamente", async () => {
    (redis.hget as jest.Mock).mockResolvedValue("5");

    const result = await getSubscriberInvitesClicks({ subscriberId: mockSubscriberId });

    expect(redis.hget).toHaveBeenCalledWith("referral:access-count", mockSubscriberId);
    expect(result).toEqual({ count: 5 });
  });

  test("Deve retornar 0 quando não houver acessos registrados", async () => {
    (redis.hget as jest.Mock).mockResolvedValue(null);

    const result = await getSubscriberInvitesClicks({ subscriberId: mockSubscriberId });

    expect(redis.hget).toHaveBeenCalledWith("referral:access-count", mockSubscriberId);
    expect(result).toEqual({ count: 0 });
  });

  test("Deve lançar um erro se o Redis falhar", async () => {
    (redis.hget as jest.Mock).mockRejectedValue(new Error("Falha no Redis"));

    await expect(getSubscriberInvitesClicks({ subscriberId: mockSubscriberId })).rejects.toThrow("Falha no Redis");

    expect(redis.hget).toHaveBeenCalledWith("referral:access-count", mockSubscriberId);
  });
});