// components/ClientLayout.js
"use client";

import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";

export default function ClientLayout({ children }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div />; // Coloque um componente de placeholder para evitar o erro de hidratação

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div data-theme={theme || "light"}>
        <Sidebar />
        {children}
      </div>
    </ThemeProvider>
  );
}
