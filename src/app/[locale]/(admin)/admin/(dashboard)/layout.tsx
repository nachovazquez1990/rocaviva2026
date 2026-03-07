import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar locale={locale} />
      <div className="lg:ml-64">
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <a
            href={`/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors"
          >
            <ExternalLink size={15} />
            Ver web
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">{user.email}</span>
            <div className="w-8 h-8 bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
