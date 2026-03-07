import {
  FolderOpen,
  MapPin,
  Newspaper,
  BookOpen,
  Users,
  Download,
  Eye,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getContentCounts, getAnalyticsSummary, getDailyViews } from "@/lib/admin/analytics-queries";

export default async function AdminDashboardPage() {
  const [counts, analytics, dailyViews] = await Promise.all([
    getContentCounts(),
    getAnalyticsSummary(),
    getDailyViews(7),
  ]);

  const weekTotal = dailyViews.reduce((sum, d) => sum + d.views, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Dashboard</h1>

      {/* Content Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Proyectos" value={counts.projects} icon={FolderOpen} />
        <StatCard label="Exposiciones" value={counts.exhibitions} icon={MapPin} />
        <StatCard label="Noticias" value={counts.news} icon={Newspaper} />
        <StatCard label="Libros" value={counts.books} icon={BookOpen} />
        <StatCard label="Colaboradores" value={counts.collaborators} icon={Users} />
        <StatCard label="Descargas libro" value={counts.downloads} icon={Download} />
      </div>

      {/* Traffic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Visitas hoy"
          value={analytics.todayViews}
          icon={Eye}
        />
        <StatCard
          label="Esta semana"
          value={analytics.weekViews}
          icon={TrendingUp}
          trend={weekTotal > 0 ? `${weekTotal} ultimos 7 dias` : undefined}
        />
        <StatCard
          label="Este mes"
          value={analytics.monthViews}
          icon={Eye}
        />
        <StatCard
          label="Total historico"
          value={analytics.totalViews}
          icon={Eye}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart (simple bar) */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Visitas ultimos 7 dias</h2>
          <div className="flex items-end gap-2 h-40">
            {dailyViews.map((day) => {
              const maxViews = Math.max(...dailyViews.map((d) => d.views), 1);
              const height = (day.views / maxViews) * 100;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-neutral-500">{day.views}</span>
                  <div
                    className="w-full bg-brand-500 transition-all min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <span className="text-[10px] text-neutral-400">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Paises (ultimo mes)</h2>
          {analytics.countries.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-2">
              {analytics.countries.slice(0, 8).map((c) => (
                <div key={c.country} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">{c.country}</span>
                  <span className="text-neutral-500 font-medium">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Distribution */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Idiomas</h2>
          {analytics.locales.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {analytics.locales.map((l) => {
                const total = analytics.monthViews || 1;
                const pct = Math.round((l.count / total) * 100);
                return (
                  <div key={l.locale}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700 uppercase font-medium">{l.locale}</span>
                      <span className="text-neutral-500">{pct}% ({l.count})</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2">
                      <div className="bg-accent-500 h-2" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Device Distribution */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Dispositivos</h2>
          {analytics.devices.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {analytics.devices.map((d) => {
                const total = analytics.monthViews || 1;
                const pct = Math.round((d.count / total) * 100);
                const label = d.device === "desktop" ? "Escritorio" : d.device === "mobile" ? "Movil" : "Tablet";
                return (
                  <div key={d.device}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700">{label}</span>
                      <span className="text-neutral-500">{pct}% ({d.count})</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2">
                      <div className="bg-brand-500 h-2" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
