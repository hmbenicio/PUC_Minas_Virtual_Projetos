import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as UserService from '../services/user.service';

/**
 * @desc    Cria um novo usuário (registro público)
 * @route   POST /api/v1/users
 * @access  Público
 */
export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.body.consentimentoDados?.termosDeUso || !req.body.consentimentoDados?.politicaDePrivacidade) {
    res.status(400);
    throw new Error("O consentimento dos Termos de Uso e Política de Privacidade é obrigatório.");
  }
  
  // Chama o serviço de registro público
  const user = await UserService.registerUserService(req.body);
  
  const userResponse = user.toObject();
  delete userResponse.senha;
  res.status(201).json(userResponse);
});

/**
 * @desc    Admin cria um novo usuário (cliente ou admin)
 * @route   POST /api/v1/admin/users
 * @access  Privado (Admin)
 */
export const createUserByAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.body.consentimentoDados) {
    req.body.consentimentoDados = {
      termosDeUso: true,
      politicaDePrivacidade: true,
      dataConsentimento: new Date()
    };
  }

 
  const user = await UserService.createUserByAdminService(req.body);
  
  const userResponse = user.toObject();
  delete userResponse.senha;

  res.status(201).json(userResponse);
});

/**
 * @desc    Autentica um usuário e retorna um token
 * @route   POST /api/v1/users/login
 * @access  Público
 */
export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        res.status(400);
        throw new Error("Email e senha são obrigatórios.");
    }
    const user = await UserService.findUserByEmailService(email);
    if (!user || !(await bcrypt.compare(senha, user.senha!))) {
        res.status(401);
        throw new Error("Credenciais inválidas.");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '8h' });
    const userResponse = user.toObject();
    delete userResponse.senha;
    res.status(200).json({ user: userResponse, token });
});

/**
 * @desc    Obtém todos os usuários
 * @route   GET /api/v1/users
 * @access  Privado (requer ser admin)
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await UserService.getAllUsersService();
  res.status(200).json(users);
});


/**
 * @desc    Obtém um usuário pelo ID
 * @route   GET /api/v1/users/:id
 * @access  Privado (requer ser dono do perfil ou admin)
 */
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // LÓGICA DE AUTORIZAÇÃO (DONO OU ADMIN)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        res.status(403); // Forbidden
        throw new Error("Acesso negado. Você só pode visualizar seus próprios dados.");
    }

    const user = await UserService.getUserByIdService(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("Usuário não encontrado");
    }
    res.status(200).json(user);
});

/**
 * @desc    Atualiza um usuário
 * @route   PUT /api/v1/users/:id
 * @access  Privado (requer ser dono do perfil ou admin)
 */
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // LÓGICA DE AUTORIZAÇÃO (DONO OU ADMIN)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        res.status(403); // Forbidden
        throw new Error("Acesso negado. Você só pode atualizar seus próprios dados.");
    }

    const updatedUser = await UserService.updateUserService(req.params.id, req.body);
    if (!updatedUser) {
        res.status(404);
        throw new Error("Usuário não encontrado para atualização");
    }
    res.status(200).json(updatedUser);
});

/**
 * @desc    Altera a senha do usuário logado
 * @route   PATCH /api/v1/users/change-password
 * @access  Privado (Qualquer usuário logado)
 */
export const changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { senhaAtual, novaSenha } = req.body;
  
  // Pegamos o ID do usuário logado direto do token (req.user.id)
  await UserService.updatePasswordService(req.user.id, senhaAtual, novaSenha);

  res.status(200).json({ message: "Senha alterada com sucesso!" });
});

/**
 * @desc    Solicita envio de email para redefinir senha
 * @route   POST /api/v1/users/forgot-password
 * @access  Público
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // MUDANÇA: Removemos req.get('host') e req.protocol. Passamos só o email.
  await UserService.forgotPasswordService(req.body.email);
  
  res.status(200).json({
    status: 'success',
    message: 'Token enviado para o e-mail!',
  });
});

/**
 * @desc    Redefine a senha usando o token
 * @route   PUT /api/v1/users/reset-password/:token
 * @access  Público
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await UserService.resetPasswordService(req.params.token, req.body.novaSenha);

  res.status(200).json({
    status: 'success',
    message: 'Senha alterada com sucesso! Faça login com a nova senha.',
  });
});

/**
 * @desc    Deleta um usuário
 * @route   DELETE /api/v1/users/:id
 * @access  Privado (requer ser dono do perfil ou admin)
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // LÓGICA DE AUTORIZAÇÃO (DONO OU ADMIN)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        res.status(403); // Forbidden
        throw new Error("Acesso negado. Você só pode deletar seus próprios dados.");
    }

    const deletedUser = await UserService.deleteUserService(req.params.id);
    if (!deletedUser) {
        res.status(404);
        throw new Error("Usuário não encontrado para exclusão");
    }
    res.status(200).json({ message: "Usuário deletado com sucesso" });
});