import User, { IUser } from '../models/user.model';
import { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import sendEmail from '../utils/email';
import { getWelcomeTemplate, getPasswordResetTemplate } from '../utils/emailTemplates';

type UserPayload = Omit<IUser, keyof Document | 'createdAt' | 'updatedAt'>;
type UpdateUserPayload = Partial<UserPayload>;

export const registerUserService = async (payload: UserPayload): Promise<IUser> => {
  const { role, ...restOfPayload } = payload;
  const user = new User(restOfPayload);
  await user.save(); 

  // Tenta enviar o e-mail (Feature secundária)
  try {
    await sendEmail({
      email: user.email,
      subject: 'Bem-vindo à AlfaStore! 🎉',
      message: `Olá ${user.nome}, bem-vindo à AlfaStore!`,
      html: getWelcomeTemplate(user.nome),
    });
  } catch (error) {
    // Se falhar (credenciais vazias ou erro de rede), apenas logamos.
    // O código NÃO para aqui.
    console.error("Falha não-crítica: Não foi possível enviar e-mail de boas-vindas.");
  }

  // Retorna o usuário criado com sucesso (Status 201)
  return user;
};


export const createUserByAdminService = async (payload: UserPayload): Promise<IUser> => {
  // Esta função confia no payload completo, incluindo o role, pois já foi validada
  // e protegida pelo middleware de admin.
  const user = new User(payload);
  return await user.save();
};

export const getAllUsersService = async (): Promise<IUser[]> => {
  return await User.find();
};

export const getUserByIdService = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const updateUserService = async (id: string, payload: UpdateUserPayload): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, payload, { new: true });
};

export const updatePasswordService = async (userId: string, senhaAtual: string, novaSenha: string): Promise<void> => {
  const user = await User.findById(userId).select('+senha');

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const isMatch = await bcrypt.compare(senhaAtual, user.senha!);
  if (!isMatch) {
    throw new Error("A senha atual está incorreta.");
  }

  user.senha = novaSenha;

  await user.save();
};

export const forgotPasswordService = async (email: string): Promise<void> => { 
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Não existe usuário com esse e-mail.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  
  // Exemplo de como ficará: http://localhost:5173/redefinir-senha/xyz...
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/redefinir-senha/${resetToken}`;

  try {
    // Usamos o template HTML de reset
    await sendEmail({
      email: user.email,
      subject: 'Redefinição de Senha - AlfaStore',
      message: `Use este link para redefinir sua senha: ${resetUrl}`, // Fallback
      html: getPasswordResetTemplate(resetUrl), // HTML bonito
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Houve um erro ao enviar o e-mail. Tente novamente.');
  }
};

export const resetPasswordService = async (token: string, novaSenha: string): Promise<void> => {
  // Criptografa o token recebido para comparar com o do banco
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Busca usuário com token válido e não expirado
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Token inválido ou expirado.');
  }

  // Atualiza a senha e limpa o token
  user.senha = novaSenha;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save(); // O pre-save hook vai hashear a nova senha automaticamente
};

export const deleteUserService = async (id: string): Promise<IUser | null> => {
  // 1. Primeiro, buscamos o usuário que será deletado
  const userToDelete = await User.findById(id);

  if (!userToDelete) {
    return null; 
  }

  if (userToDelete.role === 'admin') {
 
    const error: any = new Error("Não é permitido deletar um usuário administrador.");
    error.statusCode = 403; // Nosso errorHandler vai usar este status
    throw error;
  }

  await User.findByIdAndDelete(id);
  return userToDelete;
};

export const findUserByEmailService = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email }).select('+senha');
};