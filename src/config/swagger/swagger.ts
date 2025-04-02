export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Referral System API',
    version: '1.0.0',
    description: 'API para sistema de indicações com métricas e rankings'
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Local server' }
  ],
  tags: [
    { name: 'Subscriptions', description: 'Operações de inscrição' },
    { name: 'Invites', description: 'Gestão de convites' },
    { name: 'Ranking', description: 'Dados de classificação' }
  ],
  paths: {
    // Rotas de Subscription
    '/subscriptions': {
      post: {
        tags: ['Subscriptions'],
        summary: 'Cria uma nova inscrição',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Maria Souza' },
                  email: { type: 'string', format: 'email', example: 'maria@email.com' },
                  referral: { type: 'string', example: '1', nullable: true }
                },
                required: ['name', 'email']
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Inscrição criada com sucesso',
            content: {
              'application/json': {
                example: {
                  id: '1',
                  name: 'Maria Souza',
                  referralCode: 'MARIA456'
                }
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      },
      get: {
        tags: ['Subscriptions'],
        summary: 'Obtém todas as inscrições',
        responses: {
          200: {
            description: 'Inscrições obtidas com sucesso',
            content: {
              'application/json': {
                example: {
                  subscribers: [
                    {
                      id: '1',
                      name: 'Maria Souza',
                      referralCode: 'MARIA456'
                    }
                  ]
                }
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/subscriptions/{subscriberId}/clicks': {
      get: {
        tags: ['Subscriptions'],
        summary: 'Obtém o número de cliques em convites',
        parameters: [
          {
            name: 'subscriberId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'abc123'
          }
        ],
        responses: {
          200: {
            description: 'Número de cliques obtido',
            content: {
              'application/json': {
                example: { totalClicks: 25 }
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/subscriptions/{subscriberId}/count': {
      get: {
        tags: ['Subscriptions'],
        summary: 'Obtém o número total de convites',
        parameters: [
          {
            name: 'subscriberId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'abc123'
          }
        ],
        responses: {
          200: {
            description: 'Número de convites obtido',
            content: {
              'application/json': {
                example: { totalInvites: 10 }
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/subscriptions/{subscriberId}/position': {
      get: {
        tags: ['Subscriptions'],
        summary: 'Obtém a posição no ranking',
        parameters: [
          {
            name: 'subscriberId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'abc123'
          }
        ],
        responses: {
          200: {
            description: 'Posição no ranking obtida',
            content: {
              'application/json': {
                example: { position: 5 }
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    // Rotas de Invites
    '/invite/{subscriberId}': {
      get: {
        tags: ['Invites'],
        summary: 'Acessa link de convite',
        parameters: [
          {
            name: 'subscriberId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'xyz789'
          }
        ],
        responses: {
          200: {
            description: 'Redirecionamento realizado',
            content: {
              'text/html': {
                example: '<h1>Redirecionando...</h1>'
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    // Rotas de Ranking
    '/ranking': {
      get: {
        tags: ['Ranking'],
        summary: 'Obtém o ranking completo',
        responses: {
          200: {
            description: 'Ranking obtido com sucesso',
            content: {
              'application/json': {
                example: [
                  { position: 1, name: 'João', totalInvites: 50 },
                  { position: 2, name: 'Maria', totalInvites: 45 }
                ]
              }
            }
          },
          500: { $ref: '#/components/responses/InternalError' }
        }
      }
    }
  },
  components: {
    responses: {
      InternalError: {
        description: 'Erro interno do servidor',
        content: {
          'application/json': {
            schema: { type: 'object' },
            example: { message: 'Erro interno do servidor' }
          }
        }
      }
    }
  }
};
