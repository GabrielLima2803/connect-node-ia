import prisma from "../../../src/config/prisma/client";
import redis from "../../../src/config/redis/client";
import { subscribeToEvent } from "../../../src/usecases/subscriptions/subscriber-to-event";


jest.mock("../../../src/config/prisma/client", () => ({
  subscription: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../../src/config/redis/client", () => ({
  zincrby: jest.fn(),
}));

describe("subscribeToEvent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar o ID do assinante se ele já existir", async () => {
    const mockExistingSubscriber = { id: 1, email: "test@email.com", name: "Test User" };

    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(mockExistingSubscriber);

    const result = await subscribeToEvent({
      name: "Test User",
      email: "test@email.com",
      invitedBySubscriberId: null,
    });

    expect(prisma.subscription.findUnique).toHaveBeenCalledWith({ where: { email: "test@email.com" } });
    expect(result).toEqual({ subscriberId: 1 });
    expect(prisma.subscription.create).not.toHaveBeenCalled();
    expect(redis.zincrby).not.toHaveBeenCalled();
  });

  test("Deve criar um novo assinante e retornar seu ID se ele não existir", async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.create as jest.Mock).mockResolvedValue({ id: 2, name: "New User", email: "newuser@email.com" });

    const result = await subscribeToEvent({
      name: "New User",
      email: "newuser@email.com",
      invitedBySubscriberId: null,
    });

    expect(prisma.subscription.findUnique).toHaveBeenCalledWith({ where: { email: "newuser@email.com" } });
    expect(prisma.subscription.create).toHaveBeenCalledWith({ data: { name: "New User", email: "newuser@email.com" } });
    expect(result).toEqual({ subscriberId: 2 });
    expect(redis.zincrby).not.toHaveBeenCalled();
  });

  test("Deve incrementar o ranking do usuário que fez o convite", async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.create as jest.Mock).mockResolvedValue({ id: 3, name: "Invited User", email: "invited@email.com" });

    const result = await subscribeToEvent({
      name: "Invited User",
      email: "invited@email.com",
      invitedBySubscriberId: "1",
    });

    expect(redis.zincrby).toHaveBeenCalledWith("referral:ranking", 1, "1");
    expect(result).toEqual({ subscriberId: 3 });
  });

  test("Deve lançar um erro se houver falha na criação do assinante", async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.create as jest.Mock).mockRejectedValue(new Error("Erro no banco de dados"));

    await expect(
      subscribeToEvent({
        name: "Error User",
        email: "error@email.com",
        invitedBySubscriberId: null,
      })
    ).rejects.toThrow("Erro no banco de dados");

    expect(prisma.subscription.create).toHaveBeenCalled();
  });
});
