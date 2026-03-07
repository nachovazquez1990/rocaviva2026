import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold tracking-tight text-neutral-900">
          Rocaviva Eventos
        </h1>
        <p className="mt-4 text-xl text-neutral-500">
          Sitio en construccion - Rediseno 2026
        </p>
      </div>
    </div>
  );
}
