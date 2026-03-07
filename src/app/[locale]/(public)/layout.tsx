import { setRequestLocale } from "next-intl/server";

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
    <>
      {/* Header will go here */}
      <main>{children}</main>
      {/* Footer will go here */}
    </>
  );
}
