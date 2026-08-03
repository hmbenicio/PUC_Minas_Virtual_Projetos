"use client";

import { useEffect, useMemo, useState } from "react";
import type { SaleChannel, SaleRecord } from "@/src/app/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITENS_POR_PAGINA = 12;

const channelLabel: Record<SaleChannel, string> = {
  web: "Web",
  };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const statusColors: Record<string, string> = {
  aprovado: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  pago: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  processando: "bg-slate-100 text-slate-700 border border-slate-200",
  pendente: "bg-amber-100 text-amber-700 border border-amber-200",
  cancelado: "bg-rose-100 text-rose-700 border border-rose-200",
  devolvido: "bg-rose-100 text-rose-700 border border-rose-200",
};

interface TabelaVendasProps {
  sales: SaleRecord[];
  loading?: boolean;
}

const TabelaVendas = ({ sales, loading = false }: TabelaVendasProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    sales.forEach((sale) => {
      if (sale.status) statuses.add(sale.status);
    });
    return Array.from(statuses);
  }, [sales]);

  const filteredSales = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return sales.filter((sale) => {
      const matchesSearch = normalizedSearch
        ? sale.code.toLowerCase().includes(normalizedSearch) ||
          sale.customerName.toLowerCase().includes(normalizedSearch) ||
          (sale.customerEmail ?? "").toLowerCase().includes(normalizedSearch)
        : true;

      const matchesStatus =
        statusFilter === "todas"
          ? true
          : sale.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(filteredSales.length / ITENS_POR_PAGINA)
  );

  useEffect(() => {
    setPaginaAtual((paginaAtualAnterior) =>
      paginaAtualAnterior > totalPaginas ? 1 : paginaAtualAnterior
    );
  }, [totalPaginas]);

  const paginatedSales = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return filteredSales.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [filteredSales, paginaAtual]);

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPaginas) return;
    setPaginaAtual(page);
  };

  return (
    <div className="rounded-2xl bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/70">
      <div className="flex flex-wrap gap-3 border-b border-slate-200 px-6 py-4 dark:border-neutral-700">
        <input
          type="text"
          placeholder="Buscar por cliente ou pedido"
          value={search}
          onChange={(event) => {
            setPaginaAtual(1);
            setSearch(event.target.value);
          }}
          className="flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-800 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setPaginaAtual(1);
            setStatusFilter(event.target.value);
          }}
          className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-100"
        >
          <option value="todas">Todos os status</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm text-slate-700 dark:text-neutral-200">
          <thead>
            <tr className="bg-slate-100/70 text-xs uppercase tracking-wide text-slate-600 dark:bg-neutral-800/70 dark:text-neutral-400">
              <th className="px-4 py-3 text-left">Pedido</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Canal</th>
              <th className="px-4 py-3 text-center">Itens</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-base text-slate-500"
                >
                  Carregando vendas...
                </td>
              </tr>
            ) : paginatedSales.length > 0 ? (
              paginatedSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t border-slate-100 text-sm transition hover:bg-amber-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-neutral-50">
                    {sale.code}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-neutral-50">
                      {sale.customerName}
                    </div>
                    {sale.customerEmail && (
                      <div className="text-xs text-slate-500 dark:text-neutral-400">
                        {sale.customerEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-neutral-700 dark:text-neutral-200">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          sale.channel === "mobile"
                            ? "bg-emerald-500"
                            : sale.channel === "web"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {channelLabel[sale.channel]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {sale.itemsCount}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-300">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusColors[sale.status.toLowerCase()] ??
                        "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-neutral-800/80 dark:text-neutral-200 dark:border-neutral-700"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 dark:text-neutral-400">
                    {formatDate(sale.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-base text-slate-500 dark:text-neutral-400"
                >
                  Nenhuma venda encontrada para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredSales.length > ITENS_POR_PAGINA && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
          <span>
            Exibindo{" "}
            <strong className="text-slate-900 dark:text-neutral-100">
              {paginatedSales.length}
            </strong>{" "}
            de{" "}
            <strong className="text-slate-900 dark:text-neutral-100">
              {filteredSales.length}
            </strong>{" "}
            vendas
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationPrevious onClick={() => handleChangePage(paginaAtual - 1)} />
              {Array.from({ length: totalPaginas }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={paginaAtual === pageNumber}
                      onClick={() => handleChangePage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationNext onClick={() => handleChangePage(paginaAtual + 1)} />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default TabelaVendas;
