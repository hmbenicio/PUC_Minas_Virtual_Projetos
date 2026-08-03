// app/layout.js

import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "../lib/utils";
import { Sidebar } from "@/components/sidebar";
import ClientLayout from "@/components/ClientLayout"; // novo componente client

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OrgaNize",
  description: "Organize seu dia com eficiência",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
