"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Cog,
  Home,
  Info,
  LogIn,
  LogOut,
  LogOutIcon,
  Menu,
  User,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { useEffect, useState } from "react";

function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") == "true";
}

export function Sidebar() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    setAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <div className="flex w-full flex-col bg-muted/40">
      {/* Sidebar web */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-amber-400 sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link
              href="/"
              className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
            >
              <img
                src="/logo.png"
                alt="Logo do Projeto"
                className="h-10 w-10"
              />
              <span className="sr-only">Logo do Projeto</span>
            </Link>
          </TooltipProvider>

          {authenticated && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/homeOn"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-900 transition-colors hover:text-amber-200"
                  >
                    <Home className="w-5 h-5" />
                    <span className="sr-only">Início</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Início</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/profile"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-900 transition-colors hover:text-amber-200"
                  >
                    <User className="w-5 h-5" />
                    <span className="sr-only">Perfil</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Perfil</TooltipContent>
              </Tooltip>
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-900 transition-colors hover:text-amber-200"
              >
                <Cog className="w-5 h-5" />
                <span className="sr-only">Configurações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/about"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-900 transition-colors hover:text-amber-200"
              >
                <Info className="w-5 h-5" />
                <span className="sr-only">Sobre</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Sobre</TooltipContent>
          </Tooltip>

          {authenticated ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-900 transition-colors hover:text-amber-200"
                >
                  <LogOutIcon className="w-5 h-5" />
                  <span className="sr-only">Log out</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/login"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-900 transition-colors hover:text-amber-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="sr-only">Log in</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Log in</TooltipContent>
            </Tooltip>
          )}
        </nav>
      </aside>

      {/* Sidebar mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-amber-400 gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="Icon" variant="line" className="sm:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Abrir/Fechar Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="sm:max-w-xl bg-amber-200">
              <nav className="grid gap-6 text-lg font-medium mt-4">
                <Link
                  href="/"
                  className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                >
                  <img
                    src="/logo.png"
                    alt="Logo do Projeto"
                    className="h-10 w-10"
                  />
                  <span className="sr-only">Logo do Projeto</span>
                </Link>

                {authenticated && (
                  <>
                    <Link
                      href="/homeOn"
                      className="flex items-center gap-4 px-2.5 hover:text-amber-400 text-gray-900"
                    >
                      <Home className="h-5 w-5 transition-all" />
                      Início
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-4 px-2.5 hover:text-amber-400 text-gray-900"
                    >
                      <User className="h-5 w-5 transition-all" />
                      Perfil
                    </Link>
                  </>
                )}

                <Link
                  href="/settings"
                  className="flex items-center gap-4 px-2.5 hover:text-amber-400 text-gray-900"
                >
                  <Cog className="h-5 w-5 transition-all" />
                  Configurações
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-4 px-2.5 hover:text-amber-400 text-gray-900"
                >
                  <Info className="h-5 w-5 transition-all" />
                  Sobre
                </Link>

                {authenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-2.5 hover:text-amber-400 text-gray-900"
                  >
                    <LogOutIcon className="h-5 w-5 transition-all" />
                    Log out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-4 px-2.5 hover:text-amber-400 text-gray-900"
                  >
                    <LogIn className="h-5 w-5 transition-all" />
                    Log in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <h2 className="text-xl font-bold">OrgaNize</h2>
        </header>
      </div>
    </div>
  );
}
