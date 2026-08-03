import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import userRoutes from '../routes/user.routes';
import productRoutes from '../routes/product.routes';
import paymentRoutes from '../routes/payment.routes';
import { errorHandler } from '../middlewares/errorHandler.middleware';

// Cria uma instância do app para testes (sem rate limiting e sem conectar ao DB)
const createTestApp = () => {
  const app = express();

  // Middlewares de segurança (sem rate limiting e mongo-sanitize para testes)
  // Nota: express-mongo-sanitize tem incompatibilidade com Express 5 (req.query é read-only)
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(hpp());

  // Health check
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API da AlfaStore rodando!', timestamp: new Date().toISOString() });
  });

  // Rotas - Ordem importante: rotas públicas primeiro
  // No Express 5, router.use(authMiddleware) em userRoutes pode afetar 
  // requisições que não correspondem a rotas definidas nesse router.
  // Por isso, productRoutes (com rotas GET públicas) deve vir primeiro.
  app.use('/api/v1', productRoutes);
  app.use('/api/v1', paymentRoutes);
  app.use('/api/v1', userRoutes);

  // Error handler (deve ser o último middleware)
  app.use(errorHandler);

  return app;
};

export const testApp = createTestApp();
