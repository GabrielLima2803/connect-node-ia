import { generateText } from "ai";
import { google } from "../../../src/config/ai/google-ai";
import { postgresTools } from "../../../src/ai/tools/postgres-tool";
import { redisTools } from "../../../src/ai/tools/redis-tools";
import { answerUserMessage } from "../../../src/usecases/message-ai/answer-user-message";
import { closeRedis } from "../../../src/config/redis/client";

process.env.REDIS_URL = "redis://localhost:6379";
process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/dbname";
process.env.GOOGLE_GENERATIVE_AI_API_KEY = "chave-de-teste";

jest.mock("ai", () => ({
  generateText: jest.fn(),
  tool: jest.fn((config) => config),
}));

describe("answerUserMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar uma resposta formatada da IA", async () => {
    const mockResponse = { text: "Olá! Como posso ajudar no evento de programação?" };
    (generateText as jest.Mock).mockResolvedValue(mockResponse);

    const response = await answerUserMessage({ message: "Qual é o horário do evento?" });

    expect(generateText).toHaveBeenCalledWith({
      model: google,
      prompt: "Qual é o horário do evento?",
      tools: { postgresTools, redisTools },
      system: expect.stringContaining("Você é um assistente de IA para um evento de programação."),
      maxSteps: 5,
    });

    expect(response).toEqual({ response: "Olá! Como posso ajudar no evento de programação?" });
  });

  it("deve lidar com erros ao chamar a IA", async () => {
    (generateText as jest.Mock).mockRejectedValue(new Error("Erro na IA"));

    await expect(answerUserMessage({ message: "O evento tem palestrantes?" }))
      .rejects.toThrow("Erro na IA");

    expect(generateText).toHaveBeenCalled();
  });

  afterAll(async () => {
    await closeRedis();
  });
});
