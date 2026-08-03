import { z } from "zod";

const paymentItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Informe o nome do item."),
  description: z.string().optional(),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero."),
  unit_price: z.number().positive("Preco unitario deve ser maior que zero."),
  currency_id: z.string().default("BRL"),
  picture_url: z.string().url({ message: "URL da imagem invalida." }).optional(),
  category_id: z.string().optional(),
});

const payerSchema = z
  .object({
    email: z.string().email("Informe um email valido.").optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    identification: z
      .object({
        type: z.string(),
        number: z.string(),
      })
      .partial()
      .optional(),
    phone: z
      .object({
        area_code: z.string().optional(),
        number: z.string().optional(),
      })
      .optional(),
    address: z
      .object({
        zip_code: z.string().optional(),
        street_name: z.string().optional(),
        street_number: z.string().optional(),
        neighborhood: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
      })
      .optional(),
  })
  .partial();

const shipmentsSchema = z
  .object({
    receiver_address: z
      .object({
        zip_code: z.string().optional(),
        street_name: z.string().optional(),
        street_number: z.string().optional(),
        floor: z.string().optional(),
        apartment: z.string().optional(),
        neighborhood: z.string().optional(),
        city_name: z.string().optional(),
        state_name: z.string().optional(),
      })
      .optional(),
  })
  .partial();

const paymentPreferenceBodySchema = z.object({
  items: z.array(paymentItemSchema).min(1, "Informe ao menos um item para o pagamento."),
  external_reference: z
    .string()
    .min(1, "Informe um identificador para relacionar o pagamento ao pedido."),
  metadata: z.record(z.string(), z.any()).optional(),
  payer: payerSchema.optional(),
  shipments: shipmentsSchema.optional(),
  notification_url: z.string().url({ message: "URL de notificacao invalida." }).optional(),
  back_urls: z
    .object({
      success: z.string().url().optional(),
      failure: z.string().url().optional(),
      pending: z.string().url().optional(),
    })
    .partial()
    .optional(),
  statement_descriptor: z.string().optional(),
  binary_mode: z.boolean().optional(),
  auto_return: z.enum(["approved", "all"]).optional(),
  installments: z.number().int().positive().max(24).optional(),
  payment_methods: z.record(z.string(), z.any()).optional(),
});

export const paymentPreferenceSchema = z.object({
  body: paymentPreferenceBodySchema,
});

export type PaymentPreferenceBody = z.infer<typeof paymentPreferenceBodySchema>;
