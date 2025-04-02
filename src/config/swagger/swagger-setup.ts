import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from './swagger';

export const setupSwagger = (router: any) => {
  router.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerConfig)
  );
};