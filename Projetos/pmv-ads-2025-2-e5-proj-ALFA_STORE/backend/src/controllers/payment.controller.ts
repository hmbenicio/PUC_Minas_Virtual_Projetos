import { Request, Response } from "express";
import { createCheckoutPreference, fetchPaymentInfo } from "../services/payment.service";
import Order from "../models/order.model";
import type { PaymentStatus } from "../models/order.model";
import { PaymentPreferenceBody } from "../validators/payment.validator";

export const createPreference = async (req: Request, res: Response) => {
  try {
    const authenticatedUser = req.user;

    if (!authenticatedUser?._id) {
      return res.status(401).json({
        message: "Necessario estar autenticado para gerar um pagamento.",
      });
    }

    const payload = req.body as PaymentPreferenceBody;

    const preference = await createCheckoutPreference(payload, {
      userId: authenticatedUser._id.toString(),
      userEmail: authenticatedUser.email,
      userName: authenticatedUser.nome,
    });

    return res.status(201).json(preference);
  } catch (error) {
    console.error("Erro ao criar preferencia do Mercado Pago:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    // Verifica se é erro de configuração do token
    if (errorMessage.includes("Token de acesso do Mercado Pago nao configurado")) {
      return res.status(503).json({
        message: "Servico de pagamento temporariamente indisponivel. Tente novamente mais tarde.",
        code: "PAYMENT_SERVICE_UNAVAILABLE"
      });
    }
    
    return res.status(500).json({ 
      message: "Nao foi possivel criar a preferencia de pagamento.",
      code: "PAYMENT_PREFERENCE_ERROR"
    });
  }
};

const normalizePaymentStatus = (raw?: string): PaymentStatus => {
  if (!raw) return "pending";
  const status = raw.toLowerCase();
  if (status === "approved" || status === "authorized") return "approved";
  if (status === "rejected" || status === "cancelled" || status === "cancelado") {
    return "failure";
  }
  return "pending";
};

export const handleMercadoPagoWebhook = async (req: Request, res: Response) => {
  try {
    const typeParam = (req.query.type as string) || (req.query.topic as string);
    const idParam = (req.query.id as string) || req.body?.data?.id;

    if (!typeParam || !idParam) {
      return res.status(400).json({ message: "Notificacao invalida." });
    }

    // Somente processa notificacoes de pagamento
    if (typeParam !== "payment") {
      return res.status(200).json({ message: "Tipo de notificacao ignorado." });
    }

    const paymentInfo = await fetchPaymentInfo(idParam.toString());
    // SDK types variam, entao normalizamos o payload retornado
    const payment = (paymentInfo as any)?.body ?? (paymentInfo as any);

    if (!payment) {
      return res.status(404).json({ message: "Pagamento nao encontrado." });
    }

    const externalReference =
      payment.external_reference || payment.metadata?.external_reference;
    const preferenceId =
      payment.preference_id || payment.order?.id || payment.collection?.id;
    const paymentStatus = normalizePaymentStatus(payment.status);
    const orderStatus = paymentStatus === "approved" ? "paid" : paymentStatus === "failure" ? "cancelled" : "pending";

    if (!externalReference && !preferenceId) {
      return res.status(200).json({ message: "Pagamento sem referencia; ignorado." });
    }

    const order = await Order.findOne(
      externalReference
        ? { externalReference }
        : { preferenceId }
    );

    if (!order) {
      return res.status(200).json({ message: "Pedido nao encontrado; sem atualizacao." });
    }

    order.paymentStatus = paymentStatus;
    order.status = orderStatus;
    order.preferenceId = preferenceId ?? order.preferenceId;
    order.totalAmount = payment.transaction_amount ?? order.totalAmount;
    order.customerEmail = payment.payer?.email ?? order.customerEmail;
    const payerName = [payment.payer?.first_name, payment.payer?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (payerName) {
      order.customerName = payerName;
    }

    await order.save();

    return res.status(200).json({ message: "Pedido atualizado", paymentId: payment.id });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);
    return res.status(500).json({ message: "Erro ao processar notificacao." });
  }
};
