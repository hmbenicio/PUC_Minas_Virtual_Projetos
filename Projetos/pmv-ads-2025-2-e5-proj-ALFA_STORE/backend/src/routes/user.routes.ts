
import { Router } from 'express';

import { 
  createUser, 
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
  createUserByAdmin,
  forgotPassword, 
  resetPassword
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import validate from '../middlewares/validate.middleware';

import { 
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  adminCreateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/user.validator';

const router = Router();

// === ROTAS PÚBLICAS ===
// Cliente pode se registrar
router.post('/users', validate(createUserSchema), createUser);
router.post('/users/login', loginUser);

router.post('/users/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.put('/users/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// A partir daqui, todas as rotas precisam de autenticação
router.use(authMiddleware);

// === ROTAS PRIVADAS PARA USUÁRIOS NORMAIS E ADMINS ===
// Um usuário pode ver/editar/deletar a si mesmo. Um admin pode fazer o mesmo com qualquer um.
router.get('/users/:id', getUserById);
router.put('/users/:id', validate(updateUserSchema), updateUser);
router.patch('/users/change-password', validate(changePasswordSchema), changePassword);
router.delete('/users/:id', deleteUser);

// === ROTAS PRIVADAS APENAS PARA ADMINS ===
// Um admin pode ver todos os usuários
router.get('/users', adminMiddleware, getAllUsers);
// Um admin pode criar um novo usuário (cliente ou admin)
router.post('/admin/users', adminMiddleware, validate(adminCreateUserSchema), createUserByAdmin);

export default router;