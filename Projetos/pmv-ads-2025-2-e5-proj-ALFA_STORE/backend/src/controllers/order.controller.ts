import { Request, Response } from "express";
import Order from "../models/order.model";
import { CreateOrderInput } from "../validators/order.validator";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreateOrderInput;
    const userId = req.user?._id;

    const order = await Order.create({
      user: userId,
      customerName: payload.customer_name ?? req.user?.nome,
      customerEmail: payload.customer_email ?? req.user?.email,
      externalReference: payload.external_reference,
      preferenceId: payload.preference_id,
      paymentStatus: payload.payment_status ?? "pending",
      status:
        payload.status ??
        (payload.payment_status === "approved" ? "paid" : "pending"),
      totalAmount: payload.total_amount,
      items: payload.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingAddress: payload.shipping_address,
      metadata: payload.metadata,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Erro ao registrar pedido:", error);
    return res
      .status(500)
      .json({ message: "Nao foi possivel registrar o pedido." });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return res.json(orders);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return res
      .status(500)
      .json({ message: "Nao foi possivel listar os pedidos." });
  }
};

export const listMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Necessario autenticar para ver pedidos." });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json(orders);
  } catch (error) {
    console.error("Erro ao listar pedidos do usuario:", error);
    return res
      .status(500)
      .json({ message: "Nao foi possivel listar os seus pedidos." });
  }
};
