import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://alfastore-api.onrender.com/api/v1";

const normalizeEndpoint = (endpoint: string): string =>
  endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

const buildBackendUrl = (
  req: NextRequest,
  params: { slug?: string[] } | undefined
) => {
  const searchParams = req.nextUrl.searchParams;
  const endpointParam = searchParams.get("endpoint");
  const endpointFromSlug =
    params?.slug && params.slug.length > 0
      ? `/${params.slug.join("/")}`
      : undefined;

  const endpoint = normalizeEndpoint(
    endpointParam ?? endpointFromSlug ?? "/products"
  );

  const forwardParams = new URLSearchParams(searchParams);
  forwardParams.delete("endpoint");
  const queryString = forwardParams.toString();

  return `${BACKEND_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;
};

const getAuthHeader = (req: NextRequest) =>
  req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";

const respondWithError = (message: string) =>
  NextResponse.json({ message }, { status: 500 });

const parseResponse = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    const text = await response.text();
    return { message: text || "Resposta nao estava em JSON." };
  }
};

// Encaminha requisicoes GET para o backend, preservando o path ou o parametro endpoint.
export async function GET(
  req: NextRequest,
  context: { params: { slug?: string[] } }
) {
  try {
    const backendUrl = buildBackendUrl(req, context.params);
    const token = getAuthHeader(req);

    const response = await fetch(backendUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro no proxy GET:", error);
    return respondWithError("Erro ao buscar dados do backend.");
  }
}

// Encaminha requisicoes POST para o backend (criacao de usuarios, login, produtos etc.).
export async function POST(
  req: NextRequest,
  context: { params: { slug?: string[] } }
) {
  try {
    const backendUrl = buildBackendUrl(req, context.params);
    const body = await req.json();
    const token = getAuthHeader(req);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro no proxy POST:", error);
    return respondWithError("Erro ao enviar dados para o backend.");
  }
}

// Encaminha requisicoes PUT para atualizacao de dados.
export async function PUT(
  req: NextRequest,
  context: { params: { slug?: string[] } }
) {
  try {
    const backendUrl = buildBackendUrl(req, context.params);
    const body = await req.json();
    const token = getAuthHeader(req);

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro no proxy PUT:", error);
    return respondWithError("Erro ao atualizar dados no backend.");
  }
}

// Encaminha requisicoes DELETE para remocao de recursos.
export async function DELETE(
  req: NextRequest,
  context: { params: { slug?: string[] } }
) {
  try {
    const backendUrl = buildBackendUrl(req, context.params);
    const token = getAuthHeader(req);

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    const data = await parseResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro no proxy DELETE:", error);
    return respondWithError("Erro ao excluir dados do backend.");
  }
}
