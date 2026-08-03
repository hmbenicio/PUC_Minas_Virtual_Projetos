/**
 * AlfaStore Backend API
 * CI/CD: GitHub Actions (testes) + Render (deploy)
 */

import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import connectDB from './config/database';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import paymentRoutes from './routes/payment.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// === HEALTH CHECK (antes de qualquer middleware) ===
// Essas rotas precisam responder rapidamente sem passar por rate-limit, etc.
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API da AlfaStore rodando!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// === MIDDLEWARES DE SEGURANÇA ===

// Helmet: Define headers HTTP seguros (XSS, clickjacking, sniffing, etc)
app.use(helmet());

// CORS: Configura origens permitidas
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'https://www.alfaofc.com.br'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate Limiting: Limita requisições por IP (proteção contra brute force)
// NOTA: express-rate-limit v8 tem bug com Express v5 (req.query é read-only)
// Desabilitado temporariamente até fix ser lançado
// TODO: Reativar quando express-rate-limit lançar versão compatível com Express 5
/*
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por janela
  message: { status: 'error', message: 'Muitas requisições. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Rate Limiting mais restritivo para rotas de autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 tentativas de login por janela
  message: { status: 'error', message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/forgot-password', authLimiter);
*/

// Middleware para permitir que o Express entenda JSON (com limite de tamanho)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Mongo Sanitize: Previne NoSQL Injection
// NOTA: Também pode ter incompatibilidade com Express v5
// Desabilitado temporariamente para teste
// app.use(mongoSanitize());

// HPP: Previne HTTP Parameter Pollution
// NOTA: hpp também modifica req.query que é read-only no Express v5
// Desabilitado temporariamente
// TODO: Reativar quando hpp lançar versão compatível com Express 5
// app.use(hpp());

// Conecta ao banco de dados
connectDB();

// === ROTAS ===
// Ordem importante: rotas com endpoints públicos devem vir primeiro
// No Express 5, router.use(authMiddleware) em userRoutes pode afetar 
// requisições que não correspondem a rotas definidas nesse router.
app.use('/api/v1', productRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', userRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Exporta o app para testes
export { app };

// Só inicia o servidor se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
