import redis from "../../../src/config/redis/client";
import { accessInviteLink } from "../../../src/usecases/invite/access-invite-link";

jest.mock("../../../src/config/redis/client", () => ({
  hincrby: jest.fn(),
}));

describe("accessInviteLink", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deve incrementar o contador de acessos no Redis", async () => {
    const subscriberId = "123";

    await accessInviteLink({ subscriberId });

    expect(redis.hincrby).toHaveBeenCalledWith("referral:access-count", subscriberId, 1);
  });

  test("Deve lançar um erro se o Redis falhar", async () => {
    (redis.hincrby as jest.Mock).mockRejectedValue(new Error("Erro no Redis"));

    await expect(accessInviteLink({ subscriberId: "123" })).rejects.toThrow("Erro no Redis");

    expect(redis.hincrby).toHaveBeenCalledWith("referral:access-count", "123", 1);
  });
});
