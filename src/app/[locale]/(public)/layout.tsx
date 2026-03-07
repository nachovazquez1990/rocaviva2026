import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTracker } from "@/components/analytics/tracker";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <PageTracker locale={locale} />
      <Header />
      <main id="main-content" className="pt-20 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
