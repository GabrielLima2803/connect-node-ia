import { generateText, tool } from "ai";
import { google } from "../../config/ai/google-ai";
import AnswerUserMessageParams from "../../dtos/message-ai-request.dto";
import { postgresTools } from "../../ai/tools/postgres-tool";
import { redisTools } from "../../ai/tools/redis-tools";

export async function answerUserMessage({
  message,
}: AnswerUserMessageParams) {
  const answer = await generateText({
    model: google,
    prompt: message,
    tools: {
        postgresTools,
        redisTools,
    },
    system: `
      Você é um assistente de IA para um evento de programação. 
      Responda de forma concisa, usando markdown sem blocos de código.
    `.trim(),
    maxSteps: 5,
  });

  return { response: answer.text };
}