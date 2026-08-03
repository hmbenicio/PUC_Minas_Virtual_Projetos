"use client";

import React, { useState, useEffect } from "react";
import LayoutHome from "@/components/LayoutHome";
import TabelaUsers from "@/components/TabelaUsers";
import { User } from "../types";

const API_BASE_URL = "/api/proxy";

const decodeJwtId = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window !== "undefined"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");

    const payload = JSON.parse(json);
    return (
      payload?.id || payload?._id || payload?.userId || payload?.sub || null
    );
  } catch {
    return null;
  }
};

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string>("");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Buscar itens do backend
  const fetchItens = async () => {
    try {
      setLoading(true);
      setError("");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("userToken")
          : null;
      const roleFromStorage =
        typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

      const determinedRole: "admin" | "cliente" =
        roleFromStorage === "admin" ? "admin" : "cliente";

      setRole(determinedRole);

      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error("Falha ao buscar usuários");
      }

      const data = await res.json();
      const list: User[] = Array.isArray(data) ? data : data?.users ?? [];

      let me = "";
      if (typeof window !== "undefined") {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
          me = storedId.replace(/^"+|"+$/g, "");
        } else {
          const decodedId = decodeJwtId(token);
          if (decodedId) {
            me = decodedId;
            localStorage.setItem("userId", decodedId);
          }
        }
      }

      const listWithoutMe = me
        ? list.filter((u) => String(u._id) !== String(me))
        : list;

      setUsers(listWithoutMe);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message || "Erro ao carregar usuários"
          : "Erro ao carregar usuários"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItens();
  }, []);

  return (
    <LayoutHome role={role}>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        GERENCIAMENTO DE USUÁRIOS
      </h1>

      {error && (
        <p className="text-red-500 font-medium mb-4 bg-red-50 border border-red-200 p-2 rounded-lg">
          {error}
        </p>
      )}
      <div className="mt-8">
        <TabelaUsers
          users={users}
          selecionados={selecionados}
          onSelecionarItens={setSelecionados}
          loading={loading}
        />
      </div>

    </LayoutHome>
  );
};

export default AllUsers;
