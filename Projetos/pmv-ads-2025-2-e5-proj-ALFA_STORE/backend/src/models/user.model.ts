import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  // ... (outros campos)
  role: 'cliente' | 'admin'; // Adicionamos o campo de role
}

// Interface para tipar o documento do usuário
export interface IUser extends Document {
  nome: string;
  email: string;
  cpf: string;
  endereco: {
    rua: string;
    numero: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  telefone: string;
  senha?: string; 
  consentimentoDados: {
    termosDeUso: boolean;
    politicaDePrivacidade: boolean;
    dataConsentimento: Date;
  };
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const userSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  cpf: { type: String, required: true, unique: true },
  endereco: {
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
  },
  telefone: { type: String, required: true },
  senha: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['cliente', 'admin'], // Garante que o valor só pode ser um desses dois
    default: 'cliente'       // Todo novo usuário será um 'cliente' por padrão
  },
  consentimentoDados: {
    termosDeUso: { type: Boolean, required: true },
    politicaDePrivacidade: { type: Boolean, required: true },
    dataConsentimento: { type: Date, default: Date.now },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
}, {
  timestamps: true
});

// Hook para criptografar a senha ANTES de salvar no banco
userSchema.pre<IUser>('save', async function (next) {
  // Se a senha não foi modificada, não faz nada
  if (!this.isModified('senha') || !this.senha) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = model<IUser>('User', userSchema);

export default User;