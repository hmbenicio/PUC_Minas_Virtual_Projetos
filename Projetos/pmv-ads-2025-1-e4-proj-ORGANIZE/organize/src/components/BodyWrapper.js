// components/BodyWrapper.js
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { cn } from "../lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function BodyWrapper({ children }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div />; // Evitar problemas de hidratação

  return (
    <html lang="pt-BR" data-theme={theme || "light"} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
