import { z } from 'zod';

// Schema base para o produto, que será reutilizado
const productBaseSchema = z.object({
  nome: z.string().min(3, { message: "Nome do produto é obrigatório e deve ter no mínimo 3 caracteres." }),
  tipo: z.enum(['M', 'F', 'I', 'E'], {
    message: "O tipo do produto é obrigatório e deve ser M, F, I ou E."
}),
  tamanho: z.string().min(1, { message: "O tamanho é obrigatório." }),  // Se o campo estiver faltando, o Zod já acusa um erro de "tipo inválido" (esperava boolean, recebeu undefined).
  estampa: z.boolean(),
  preco: z.number().positive({ message: "O preço deve ser um número positivo." }),
  quantidade: z.number().int().min(0, { message: "A quantidade não pode ser negativa." }),
  promo: z.boolean().optional().default(false),
  precoPromo: z.number().positive({ message: "O preço promocional deve ser positivo." }).optional(),
  imagem: z.string().optional(),
  ads: z.string().optional(),
});

// Validação customizada para a lógica de promoção
export const createProductSchema = z.object({
  body: productBaseSchema.superRefine((data, ctx) => {
    if (data.promo === true && !data.precoPromo) {
      ctx.addIssue({
        code: 'custom',
        path: ['precoPromo'],
        message: 'Preço promocional é obrigatório quando a promoção está ativa.',
      });
    }
    if (data.precoPromo && data.precoPromo >= data.preco) {
      ctx.addIssue({
        code: 'custom',
        path: ['precoPromo'],
        message: 'Preço promocional deve ser menor que o preço normal.',
      });
    }
  }),
});

// Para atualização, todos os campos são opcionais
export const updateProductSchema = z.object({
  body: productBaseSchema.partial().superRefine((data, ctx) => {
    if (data.precoPromo && data.preco && data.precoPromo >= data.preco) {
       ctx.addIssue({
        code: 'custom',
        path: ['precoPromo'],
        message: 'Preço promocional deve ser menor que o preço normal.',
      });
    }
  }),
  params: z.object({
    id: z.string().min(1, { message: "ID do produto é obrigatório." }),
  }),
});