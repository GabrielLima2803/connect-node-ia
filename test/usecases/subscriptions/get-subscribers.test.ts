import prisma from "../../../src/config/prisma/client";
import { getSubscribers } from "../../../src/usecases/subscriptions/get-subscribers";

jest.mock("../../../src/config/prisma/client", () => ({
  subscription: {
    findMany: jest.fn(),
  },
}));

describe("getSubscribers", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("Deve retornar a lista de assinantes corretamente", async () => {
    const mockSubscribers = [
      { id: 1, name: "Usuário 1", email: "user1@email.com" },
      { id: 2, name: "Usuário 2", email: "user2@email.com" },
    ];

    (prisma.subscription.findMany as jest.Mock).mockResolvedValue(mockSubscribers);

    const result = await getSubscribers();

    expect(prisma.subscription.findMany).toHaveBeenCalled(); 
    expect(result).toEqual({ subscribers: mockSubscribers }); 
  });

  test("Deve retornar uma lista vazia quando não há assinantes", async () => {
    (prisma.subscription.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getSubscribers();

    expect(prisma.subscription.findMany).toHaveBeenCalled();
    expect(result).toEqual({ subscribers: [] });
  });

  test("Deve lançar um erro se a consulta ao banco falhar", async () => {
    (prisma.subscription.findMany as jest.Mock).mockRejectedValue(new Error("Falha no banco de dados"));

    await expect(getSubscribers()).rejects.toThrow("Falha no banco de dados");

    expect(prisma.subscription.findMany).toHaveBeenCalled();
  });
});
