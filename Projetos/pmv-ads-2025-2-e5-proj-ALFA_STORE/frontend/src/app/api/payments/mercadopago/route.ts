import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

type PreferenceItem = {
  id?: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  picture_url?: string;
  category_id?: string;
};

type PreferencePayload = {
  items?: PreferenceItem[];
  external_reference?: string;
  metadata?: Record<string, unknown>;
  payer?: Record<string, unknown>;
  shipments?: Record<string, unknown>;
  notification_url?: string;
  back_urls?: Record<string, string>;
  statement_descriptor?: string;
  binary_mode?: boolean;
  auto_return?: "approved" | "all";
  installments?: number;
  payment_methods?: Record<string, unknown>;
};

const getPreferenceClient = () => {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      "Token de acesso do Mercado Pago nao configurado. Defina MERCADO_PAGO_ACCESS_TOKEN no arquivo .env.local."
    );
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 8000 },
  });

  return new Preference(client);
};

const DEFAULT_FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL ?? "https://www.alfaofc.com.br";

const withDefaultBackUrls = (input?: Record<string, string>) => {
  const fallback = {
    success: `${DEFAULT_FRONTEND_BASE_URL}/shop?status=success`,
    failure: `${DEFAULT_FRONTEND_BASE_URL}/shop?status=failure`,
    pending: `${DEFAULT_FRONTEND_BASE_URL}/shop?status=pending`,
  };

  if (!input) return fallback;

  return {
    ...fallback,
    ...Object.fromEntries(
      Object.entries(input).filter(
        ([, value]) => typeof value === "string" && value.length > 0
      )
    ),
  };
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

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as PreferencePayload;

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return NextResponse.json(
        { message: "Informe ao menos um item para gerar o pagamento." },
        { status: 400 }
      );
    }

    if (!payload.external_reference) {
      return NextResponse.json(
        { message: "Informe um identificador externo (external_reference)." },
        { status: 400 }
      );
    }

    const preferenceClient = getPreferenceClient();

    const statementDescriptor =
      payload.statement_descriptor ??
      process.env.MERCADO_PAGO_STATEMENT_DESCRIPTOR ??
      "ALFASTORE";

    const resolvedNotificationUrl = sanitizeNotificationUrl(
      payload.notification_url || process.env.MERCADO_PAGO_NOTIFICATION_URL
    );

    const preferenceResponse = await preferenceClient.create({
      body: {
        items: payload.items.map((item, index) => ({
          ...item,
          id: item.id ?? `item-${index + 1}`,
          currency_id: item.currency_id ?? "BRL",
        })),
        external_reference: payload.external_reference,
        metadata: payload.metadata,
        payer: payload.payer,
        shipments: payload.shipments,
        notification_url: resolvedNotificationUrl,
        back_urls: withDefaultBackUrls(payload.back_urls),
        statement_descriptor: statementDescriptor.substring(0, 13),
        binary_mode: payload.binary_mode ?? false,
        auto_return: payload.auto_return ?? "approved",
        payment_methods: payload.payment_methods,
      },
    });

    return NextResponse.json(preferenceResponse);
  } catch (error) {
    console.error("Erro ao criar preferencia Mercado Pago:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel criar a preferencia de pagamento.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
