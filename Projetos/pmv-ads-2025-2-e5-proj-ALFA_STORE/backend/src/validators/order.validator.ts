import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
});

export const createOrderSchema = z.object({
  body: z.object({
    external_reference: z.string().min(1, "Informe o identificador externo."),
    preference_id: z.string().optional(),
    payment_status: z.enum(["pending", "approved", "failure"]).default("pending"),
    status: z.enum(["pending", "paid", "cancelled"]).optional(),
    total_amount: z.number().min(0),
    customer_name: z.string().optional(),
    customer_email: z.string().email().optional(),
    items: z.array(orderItemSchema).min(1, "Informe ao menos um item."),
    shipping_address: z.record(z.string(), z.any()).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
