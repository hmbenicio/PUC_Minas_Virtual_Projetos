"use client";

import { useEffect, useMemo, useState } from "react";

import LayoutHome from "@/components/LayoutHome";
import TabelaVendas from "@/components/TabelaVendas";
import type { OrderDto, PaymentStatus, SaleRecord } from "@/src/app/types";

const API_BASE_URL = "/api/proxy";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const normalizeStatus = (
  rawStatus: string
): "concluida" | "pendente" | "cancelada" => {
  const status = rawStatus.toLowerCase();
  if (
    status.includes("cancel") ||
    status.includes("negad") ||
    status.includes("falha")
  ) {
    return "cancelada";
  }
  if (
    status.includes("pend") ||
    status.includes("aguard") ||
    status.includes("analise")
  ) {
    return "pendente";
  }
  return "concluida";
};

const MONTH_LABELS: { label: string; monthIndex: number }[] = [
  { label: "Jan", monthIndex: 0 },
  { label: "Fev", monthIndex: 1 },
  { label: "Mar", monthIndex: 2 },
  { label: "Abr", monthIndex: 3 },
  { label: "Mai", monthIndex: 4 },
  { label: "Jun", monthIndex: 5 },
  { label: "Jul", monthIndex: 6 },
  { label: "Ago", monthIndex: 7 },
  { label: "Set", monthIndex: 8 },
  { label: "Out", monthIndex: 9 },
  { label: "Nov", monthIndex: 10 },
  { label: "Dez", monthIndex: 11 },
];

const paymentStatusLabel = (status: PaymentStatus) => {
  if (status === "approved") return "aprovado";
  if (status === "failure") return "cancelado";
  return "pendente";
};

const mapOrderToSale = (order: OrderDto): SaleRecord => {
  const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const code =
    order.externalReference ||
    order.preferenceId ||
    `PED-${order._id.substring(0, 6).toUpperCase()}`;

  return {
    id: order._id,
    code,
    customerName: order.customerName ?? "Cliente",
    customerEmail: order.customerEmail,
    channel: "web",
    itemsCount,
    total: order.totalAmount,
    status: paymentStatusLabel(order.paymentStatus),
    createdAt: order.createdAt,
  };
};

const buildComparativeSeries = (sales: SaleRecord[]) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const totals = new Map<string, number>();

  sales.forEach((sale) => {
    const date = new Date(sale.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    totals.set(key, (totals.get(key) ?? 0) + sale.total);
  });

  return MONTH_LABELS.map(({ label, monthIndex }) => {
    const currentValue = totals.get(`${currentYear}-${monthIndex}`) ?? 0;
    const previousValue = totals.get(`${previousYear}-${monthIndex}`) ?? 0;

    return {
      label,
      currentValue: Number(currentValue.toFixed(2)),
      previousValue: Number(previousValue.toFixed(2)),
    };
  });
};

const VendaProdutos = () => {
  const [role, setRole] = useState("");
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const roleFromStorage = localStorage.getItem("userRole");
    const determinedRole = roleFromStorage === "admin" ? "admin" : "cliente";
    setRole(determinedRole);
  }, []);

  useEffect(() => {
    if (role !== "admin") return;

    const fetchOrders = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          throw new Error("Token nao encontrado para carregar vendas.");
        }

        const response = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          },
        });

        const data = (await response.json().catch(() => ([]))) as OrderDto[];
        if (!response.ok) {
          throw new Error(data?.[0]?.message || "Falha ao carregar vendas.");
        }

        setSales(data.map(mapOrderToSale));
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
        setSales([]);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar as vendas."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role]);

  const summary = useMemo(() => {
    const emptyStatus = {
      concluida: 0,
      pendente: 0,
      cancelada: 0,
    };

    if (!sales.length) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageTicket: 0,
        statusCounts: emptyStatus,
        comparativeSeries: buildComparativeSeries([]),
      };
    }

    const statusCounts = { ...emptyStatus };

    const totalRevenue = sales.reduce((sum, sale) => {
      const statusKey = normalizeStatus(sale.status);
      statusCounts[statusKey] += 1;
      return sum + sale.total;
    }, 0);

    return {
      totalOrders: sales.length,
      totalRevenue,
      averageTicket: sales.length ? totalRevenue / sales.length : 0,
      statusCounts,
      comparativeSeries: buildComparativeSeries(sales),
    };
  }, [sales]);

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const comparativeSeries = summary.comparativeSeries;
  const monthlyMax = Math.max(
    ...comparativeSeries.flatMap((entry) => [
      entry.currentValue,
      entry.previousValue,
    ]),
    1
  );

  const renderUnauthorized = () => (
    <div className="rounded-2xl border border-red-200/60 bg-white/80 p-8 text-center shadow-lg dark:border-red-500/30 dark:bg-neutral-900/70">
      <p className="text-lg font-semibold text-red-700 dark:text-red-300">
        Área restrita
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
        Somente administradores podem visualizar os resultados de vendas.
      </p>
    </div>
  );

  return (
    <LayoutHome role={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            GERENCIAMENTO DE VENDAS
          </h1>
          <p className="text-gray-800 dark:text-gray-300">
            RESULTADO CONSOLIDADO
          </p>
        </div>

        {role && role !== "admin" ? (
          renderUnauthorized()
        ) : (
          <>
            {loadError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
                {loadError}
              </div>
            )}
            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="text-sm text-slate-500 dark:text-neutral-400">
                  Total de vendas
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-neutral-50">
                  {summary.totalOrders}
                </p>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                  {summary.totalOrders} registros únicos
                </span>
              </article>
              <article className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="text-sm text-slate-500 dark:text-neutral-400">
                  Receita acumulada
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                  {currencyFormatter.format(summary.totalRevenue)}
                </p>
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  Ticket médio{" "}
                  {currencyFormatter.format(summary.averageTicket || 0)}
                </span>
              </article>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Concluídas",
                  value: summary.statusCounts.concluida,
                  accent: "text-emerald-600",
                  border: "border-emerald-100 dark:border-emerald-400/30",
                },
                {
                  label: "Pendentes",
                  value: summary.statusCounts.pendente,
                  accent: "text-amber-600",
                  border: "border-amber-100 dark:border-amber-400/30",
                },
                {
                  label: "Canceladas",
                  value: summary.statusCounts.cancelada,
                  accent: "text-rose-600",
                  border: "border-rose-100 dark:border-rose-400/30",
                },
              ].map((card) => (
                <article
                  key={card.label}
                  className={`rounded-2xl border ${card.border} bg-white/80 p-4 shadow-lg dark:bg-neutral-900/70`}
                >
                  <p className="text-sm text-slate-500 dark:text-neutral-400">
                    {card.label}
                  </p>
                  <p className={`mt-2 text-3xl font-bold ${card.accent}`}>
                    {card.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-50">
                    Evolução mensal
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-neutral-400">
                    Receita confirmada por mês (ano atual x ano anterior).
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wide">
                  <span className="flex items-center gap-2 text-red-500">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {currentYear}
                  </span>
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    {previousYear}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-12 gap-3">
                  {comparativeSeries.map((entry) => {
                    const currentHeight =
                      monthlyMax > 0
                        ? Math.max((entry.currentValue / monthlyMax) * 100, 4)
                        : 4;
                    const previousHeight =
                      monthlyMax > 0
                        ? Math.max((entry.previousValue / monthlyMax) * 100, 4)
                        : 4;
                    return (
                      <div
                        key={entry.label}
                        className="flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400"
                      >
                        <div className="flex h-40 w-full items-end justify-between gap-1 rounded-lg bg-slate-100/60 p-1 dark:bg-neutral-800/60">
                          <span
                            className="flex-1 rounded-t bg-red-500 transition-[height]"
                            style={{ height: `${currentHeight}%` }}
                            title={`Atual: ${currencyFormatter.format(
                              entry.currentValue
                            )}`}
                          />
                          <span
                            className="flex-1 rounded-t bg-slate-400 transition-[height]"
                            style={{ height: `${previousHeight}%` }}
                            title={`Ano anterior: ${currencyFormatter.format(
                              entry.previousValue
                            )}`}
                          />
                        </div>
                        <span>{entry.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                  {comparativeSeries.map((entry) => (
                    <div key={`legend-${entry.label}`}>
                      <p>{entry.label}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-neutral-50">
                        {currencyFormatter.format(entry.currentValue)}
                      </p>
                      <p className="text-[0.65rem] font-medium text-slate-400">
                        {currencyFormatter.format(entry.previousValue)} em{" "}
                        {previousYear}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-neutral-50">
                    TODAS AS VENDAS
                  </h2>
                </div>
              </div>

              <TabelaVendas sales={sales} loading={loading} />
            </section>
          </>
        )}
      </div>
    </LayoutHome>
  );
};

export default VendaProdutos;
