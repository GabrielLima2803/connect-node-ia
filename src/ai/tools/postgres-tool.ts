import { tool } from "ai";
import z from "zod";
import prisma from "../../config/prisma/client";

const ALLOWED_COLUMNS = ['id', 'name', 'email', 'created_at'];
const ALLOWED_TABLE = 'subscription';

export const postgresTools = tool({
    description: `
    Realiza consultas SELECT na tabela 'subscription' do PostgreSQL.

    Estrutura da tabela:
    - id (UUID, gerado automaticamente)
    - name (VARCHAR(100))
    - email (VARCHAR(255), único)
    - created_at (TIMESTAMP, data de criação)

    Limite: 50 resultados por consulta.
  `.trim(),
  parameters: z.object({
    query: z.string().describe('Consulta SELECT para executar. Exemplo: "SELECT name FROM subscription"'),
    params: z.array(z.string()).optional().describe('Parâmetros da query (opcional)'),
  }),
  execute: async ({ query }) => {
    console.log(query)
    const cleanedQuery = query
    .trim()
    .replace(/;+/g, '') 
    .replace(/\s+/g, ' '); 

  if (!cleanedQuery.toLowerCase().startsWith('select')) {
    throw new Error('Apenas operações SELECT são permitidas');
  }

  const forbiddenPatterns = [
    /(\bdelete\b|\binsert\b|\bupdate\b|\bdrop\b|\btruncate\b)/gi,
    /(\bpg_\w+\b|\brun\b)/gi, 
    /(--|\/\*|\*\/)/gi 
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(cleanedQuery)) {
      throw new Error('Query contém operações não permitidas');
    }
  }

  const fromClauseMatch = cleanedQuery.match(/from\s+(\w+)/i);
  const tableName = fromClauseMatch?.[1]?.toLowerCase();

  if (!tableName || tableName !== ALLOWED_TABLE) {
    throw new Error('Acesso a tabelas não permitidas');
  }

  const selectedColumns = cleanedQuery
    .match(/select\s+(.*?)\s+from/i)?.[1]
    .split(',')
    .map(col => col.trim().toLowerCase());

  if (selectedColumns?.some(col => !ALLOWED_COLUMNS.includes(col))) {
    throw new Error('Tentativa de acesso a colunas não permitidas');
  }

  const finalQuery = cleanedQuery
    .replace(/limit\s+\d+/gi, '')
    .concat(` LIMIT 50`);

  try {
    const result = await prisma.$queryRawUnsafe(finalQuery);
    return JSON.stringify(result);
  } catch (error) {
    console.error('Erro na query:', error);
    throw new Error('Falha na execução da query');
  }
}
});
