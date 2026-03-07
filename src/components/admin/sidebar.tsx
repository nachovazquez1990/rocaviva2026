"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  MapPin,
  Newspaper,
  BookOpen,
  Users,
  Home,
  Download,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyectos", icon: FolderOpen },
  { href: "/admin/exhibitions", label: "Exposiciones", icon: MapPin },
  { href: "/admin/communication", label: "Comunicacion", icon: Newspaper },
  { href: "/admin/books", label: "Libros", icon: BookOpen },
  { href: "/admin/collaborators", label: "Colaboradores", icon: Users },
  { href: "/admin/home-content", label: "Contenido Home", icon: Home },
  { href: "/admin/downloads", label: "Descargas", icon: Download },
  { href: "/admin/analytics", label: "Estadisticas", icon: BarChart3 },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}/admin/login`;
  }

  function isActive(href: string) {
    const fullHref = `/${locale}${href}`;
    if (href === "/admin") return pathname === fullHref;
    return pathname.startsWith(fullHref);
  }

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="p-6 border-b border-neutral-200">
        <h1 className="font-display text-xl font-bold text-brand-600 tracking-wide">
          ROCAVIVA
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Panel de Administracion</p>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700 border-r-2 border-brand-600 font-medium"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 text-sm text-neutral-600 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={18} />
          Cerrar sesion
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow-md"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-white border-r border-neutral-200 z-40 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {nav}
      </aside>
    </>
  );
}
