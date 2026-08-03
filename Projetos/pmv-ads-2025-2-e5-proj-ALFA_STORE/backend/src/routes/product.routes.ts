import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import validate from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

const router = Router();

// === ROTAS PÚBLICAS ===
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

// === ROTAS PRIVADAS (ADMIN) ===
// Para criar, atualizar ou deletar, o usuário deve estar logado (auth) E ser admin (admin)
router.post('/products', authMiddleware, adminMiddleware, validate(createProductSchema), createProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, validate(updateProductSchema), updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;