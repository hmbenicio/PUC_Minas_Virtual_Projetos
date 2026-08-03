// types.ts
export interface Item {
  id: string;
  codigo: number;
  nome: string;
  marca?: string;
  fornecedor?: string;
  secao?: string;
  grupo?: string;
  subgrupo?: string;
  ncm?: string;
  datCriacao?: string;
  datAtualizacao?: string;
}

// API - Users
export interface Endereco {
  rua: string;
  numero: string;
  cidade: string;
  estado: string; // UF com 2 letras (ex: "MG")
  cep: string; // formato XXXXX-XXX
}

export interface ConsentimentoDados {
  termosDeUso: boolean;
  politicaDePrivacidade: boolean;
}

export interface User {
  _id?: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  role?: "cliente" | "admin";
  endereco: Endereco;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiValidationIssue {
  code?: string;
  validation?: string;
  message: string;
  path?: (string | number)[];
  minimum?: number;
}

export interface ApiErrorResponse {
  status?: string;
  statusCode?: number;
  message: string;
  errors?: ApiValidationIssue[];
  error?: string;
}

export type SaleChannel = "web";

export interface SaleRecord {
  id: string;
  code: string;
  customerName: string;
  customerEmail?: string;
  channel: SaleChannel;
  itemsCount: number;
  total: number;
  status: string;
  createdAt: string;
}

export type PaymentStatus = "pending" | "approved" | "failure";

export interface OrderItemSummary {
  productId?: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  _id: string;
  externalReference: string;
  preferenceId?: string;
  paymentStatus: PaymentStatus;
  status: "pending" | "paid" | "cancelled";
  totalAmount: number;
  items: OrderItemSummary[];
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
}
