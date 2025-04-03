import { tool } from "ai";
import z from "zod";
import redis from "../../config/redis/client.";

const allowedCommands = ["GET", "HGET", "ZREVRANGE"];

export const redisTools = tool({
    description: `
    Realiza um comando no redis para buscar informações sobre p sistema de indicações como o número de cliques no link, números de indicações (convites) realizados e ranking de indicações.

    Só pode ser utilizada para buscar dados do Redis, não pode executar nenhum comando de escrita.

    Você pode buscar dados de:

    - Um hash chamado "referral:access-count" que guarda o número de cliques/acessos no link de convite/indicação de cada usuário no formato { "SUBSCRIBER_ID": "NUMEROS_DE_CLIQUES" } onde SUBSCRIBER_ID vem do Postgres.
    - Um zset chamado "referral:ranking" que guarda o total de convites/indicação de cada usuário onde o score é a quantidade de convites/indicação e o conteúdo é o SUBSCRIBER_ID que vem do Postgres.

    Limite: 50 resultados por consulta.
  `.trim(),
  parameters: z.object({
    command: z.string()
      .refine(
        (cmd) => allowedCommands.includes(cmd.toUpperCase()),
        { message: "Comando não permitido. Utilize apenas GET, HGET ou ZREVRANGE." }
      )
      .describe('Comando a ser executado no Redis (permitido apenas: GET, HGET, ZREVRANGE)'),
    args: z.array(z.string())
      .describe('Argumentos a serem passados após o comando do Redis'),
  }),
  execute: async ({ command, args }) => {
    const safeCommand = command.toUpperCase();
    console.log("Executando comando:", safeCommand, args);
    
    const result = await redis.call(safeCommand, args);
    return JSON.stringify(result);
  }
});