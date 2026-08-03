import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { PaymentPreferenceBody } from "../validators/payment.validator";

const DEFAULT_FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL ?? "https://www.alfaofc.com.br";

interface PreferenceContext {
  userId: string;
  userEmail?: string;
  userName?: string;
}

const getPreferenceClient = () => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      "Token de acesso do Mercado Pago nao configurado. Defina MERCADO_PAGO_ACCESS_TOKEN no arquivo .env."
    );
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 8000 },
  });

  return new Preference(client);
};

const getPaymentClient = () => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      "Token de acesso do Mercado Pago nao configurado. Defina MERCADO_PAGO_ACCESS_TOKEN no arquivo .env."
    );
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 8000 },
  });

  return new Payment(client);
};

const sanitizeNotificationUrl = (input?: string): string | undefined => {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  if (!/^https?:\/\//i.test(trimmed)) return undefined;
  try {
    const parsed = new URL(trimmed);
    return parsed.toString();
  } catch {
    return undefined;
  }
};

export const createCheckoutPreference = async (
  payload: PaymentPreferenceBody,
  context: PreferenceContext
) => {
  const preferenceClient = getPreferenceClient();

  const defaultBackUrls = {
    success:
      process.env.MERCADO_PAGO_SUCCESS_URL ??
      `${DEFAULT_FRONTEND_BASE_URL}/shop?status=success`,
    failure:
      process.env.MERCADO_PAGO_FAILURE_URL ??
      `${DEFAULT_FRONTEND_BASE_URL}/shop?status=failure`,
    pending:
      process.env.MERCADO_PAGO_PENDING_URL ??
      `${DEFAULT_FRONTEND_BASE_URL}/shop?status=pending`,
  };

  const statementDescriptor =
    payload.statement_descriptor ??
    process.env.MERCADO_PAGO_STATEMENT_DESCRIPTOR ??
    "ALFASTORE";

  const normalizedPayer = payload.payer
    ? {
        ...payload.payer,
        email: payload.payer.email ?? context.userEmail,
        first_name:
          payload.payer.first_name ?? payload.payer.name ?? context.userName,
        last_name: payload.payer.last_name ?? payload.payer.surname,
      }
    : {
        email: context.userEmail,
        first_name: context.userName,
      };

  const paymentMethods =
    payload.payment_methods ??
    {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: payload.installments ?? 12,
    };

  const notificationUrl = sanitizeNotificationUrl(
    payload.notification_url || process.env.MERCADO_PAGO_NOTIFICATION_URL
  );

  const preferenceResponse = await preferenceClient.create({
    body: {
      items: payload.items.map((item, index) => ({
        ...item,
        id: item.id ?? `item-${index + 1}`,
      })),
      external_reference: payload.external_reference,
      notification_url: notificationUrl,
      back_urls: {
        ...defaultBackUrls,
        ...payload.back_urls,
      },
      auto_return: payload.auto_return ?? "approved",
      binary_mode: payload.binary_mode ?? false,
      statement_descriptor: statementDescriptor.substring(0, 13),
      metadata: {
        ...payload.metadata,
        userId: context.userId,
      },
      payer: normalizedPayer,
      shipments: payload.shipments,
      payment_methods: paymentMethods,
    },
  });

  return preferenceResponse;
};

export const fetchPaymentInfo = async (paymentId: string) => {
  const paymentClient = getPaymentClient();
  const response = await paymentClient.get({ id: paymentId });
  return response;
};
