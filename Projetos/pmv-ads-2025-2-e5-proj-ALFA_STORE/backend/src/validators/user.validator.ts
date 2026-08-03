// src/validators/user.validator.ts
import { z } from 'zod';

const enderecoSchema = z.object({
  rua: z.string().min(3, { message: "Rua é obrigatória e deve ter no mínimo 3 caracteres." }),
  numero: z.string().min(1, { message: "Número é obrigatório." }),
  cidade: z.string().min(1, { message: "Cidade é obrigatória." }),
  estado: z.string().length(2, { message: "Estado deve ter exatamente 2 caracteres." }),
  cep: z.string().regex(/^\d{5}-\d{3}$/, { message: "Formato de CEP inválido (use XXXXX-XXX)." }),
});

const consentimentoDadosSchema = z.object({
  termosDeUso: z.literal(true, { message: "É necessário aceitar os Termos de Uso." }),
  politicaDePrivacidade: z.literal(true, { message: "É necessário aceitar a Política de Privacidade." }),
});

// Regex para validação de senha forte
// Deve conter: mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial
const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const senhaForteMessage = "A senha deve ter no mínimo 8 caracteres, incluindo: 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&).";

export const createUserSchema = z.object({
  body: z.object({
    nome: z.string().min(3, { message: "Nome é obrigatório e deve ter no mínimo 3 caracteres." }),
    email: z.string().email({ message: "Formato de email inválido." }).toLowerCase(),
    // A validação de formato do CPF já garante que ele não é vazio
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "Formato de CPF inválido (use XXX.XXX.XXX-XX)." }),
    // Usei .min(10) para aceitar telefones fixos e celulares com ou sem 9
    telefone: z.string().regex(/^\d{10,11}$/, { message: "Formato de telefone inválido. Use apenas números, com DDD." }),
    senha: z.string().regex(senhaForteRegex, { message: senhaForteMessage }),
    endereco: enderecoSchema,
    consentimentoDados: consentimentoDadosSchema,
  }),
});


export const adminCreateUserSchema = z.object({
  body: z.object({
    nome: z.string().min(3, { message: "Nome é obrigatório." }),
    email: z.string().email({ message: "Formato de email inválido." }).toLowerCase(),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "Formato de CPF inválido." }),
    telefone: z.string().regex(/^\d{10,11}$/, { message: "Formato de telefone inválido." }),
    senha: z.string().regex(senhaForteRegex, { message: senhaForteMessage }),
    endereco: enderecoSchema,
    // O campo 'role' é opcional. Se não for fornecido, o padrão 'cliente' do Model será usado.
    role: z.enum(['cliente', 'admin']).optional(),
    // Consentimento é opcional quando um admin cria, pois é uma ação administrativa.
    consentimentoDados: consentimentoDadosSchema.optional(),
  }),
});


export const updateUserSchema = z.object({
  body: z.object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres.").optional(),
    telefone: z.string().regex(/^\d{10,11}$/, "Formato de telefone inválido.").optional(),
    endereco: enderecoSchema.partial().optional(),
    // ADICIONADO: Permitimos que um admin altere o role de um usuário.
    role: z.enum(['cliente', 'admin']).optional(),
  }).strict(),
  params: z.object({
    id: z.string().min(1, { message: "ID do usuário é obrigatório." }),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    senhaAtual: z.string().min(1, "A senha atual é obrigatória."),
    novaSenha: z.string().regex(senhaForteRegex, { message: senhaForteMessage }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de email inválido."),
  }),
});

// Validação para "Redefinir senha" (nova senha)
export const resetPasswordSchema = z.object({
  body: z.object({
    novaSenha: z.string().regex(senhaForteRegex, { message: senhaForteMessage }),
  }),
  params: z.object({
    token: z.string().min(1, "Token é obrigatório."),
  }),
});