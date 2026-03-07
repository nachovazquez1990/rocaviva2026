import {
  Eye,
  Users,
  Globe,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getAnalyticsSummary, getDailyViews } from "@/lib/admin/analytics-queries";
import { AnalyticsPdfExport } from "@/components/admin/analytics-pdf-export";

const deviceIcons: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export default async function AnalyticsPage() {
  const [analytics, dailyViews] = await Promise.all([
    getAnalyticsSummary(),
    getDailyViews(30),
  ]);

  const maxDaily = Math.max(...dailyViews.map((d) => d.views), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Estadisticas</h1>
        <AnalyticsPdfExport
          data={{
            totalViews: analytics.totalViews,
            todayViews: analytics.todayViews,
            weekViews: analytics.weekViews,
            monthViews: analytics.monthViews,
            uniqueVisitors: analytics.uniqueVisitors,
            newVisitors: analytics.newVisitors,
            returningVisitors: analytics.returningVisitors,
            countries: analytics.countries,
            locales: analytics.locales,
            devices: analytics.devices,
            pages: analytics.pages,
            referrers: analytics.referrers,
            eventsByType: analytics.eventsByType,
            topClicks: analytics.topClicks,
            dailyViews,
          }}
        />
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Visitas hoy" value={analytics.todayViews} icon={Eye} />
        <StatCard label="Esta semana" value={analytics.weekViews} icon={TrendingUp} />
        <StatCard label="Este mes" value={analytics.monthViews} icon={Eye} />
        <StatCard label="Visitantes unicos (mes)" value={analytics.uniqueVisitors} icon={Users} />
      </div>

      {/* New vs Returning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Visitantes nuevos (mes)"
          value={analytics.newVisitors}
          icon={UserPlus}
          trend={analytics.monthViews > 0 ? `${Math.round((analytics.newVisitors / analytics.monthViews) * 100)}% del total` : undefined}
          trendUp
        />
        <StatCard
          label="Visitantes recurrentes (mes)"
          value={analytics.returningVisitors}
          icon={UserCheck}
          trend={analytics.monthViews > 0 ? `${Math.round((analytics.returningVisitors / analytics.monthViews) * 100)}% del total` : undefined}
          trendUp
        />
      </div>

      {/* Daily Chart - 30 days */}
      <div className="bg-white border border-neutral-200 p-6 mb-8">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Visitas diarias (30 dias)</h2>
        <div className="flex items-end gap-[2px] h-48 overflow-x-auto">
          {dailyViews.map((day) => {
            const height = (day.views / maxDaily) * 100;
            return (
              <div key={day.date} className="flex-1 min-w-[8px] flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-brand-400 hover:bg-brand-600 transition-colors min-h-[2px] cursor-pointer"
                  style={{ height: `${Math.max(height, 1)}%` }}
                  title={`${day.date}: ${day.views} visitas`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-neutral-400 mt-2">
          <span>{dailyViews[0]?.date.slice(5)}</span>
          <span>{dailyViews[Math.floor(dailyViews.length / 2)]?.date.slice(5)}</span>
          <span>{dailyViews[dailyViews.length - 1]?.date.slice(5)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Countries */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
            <Globe size={16} /> Paises
          </h2>
          {analytics.countries.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-2">
              {analytics.countries.map((c) => {
                const pct = Math.round((c.count / analytics.monthViews) * 100);
                return (
                  <div key={c.country}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-700">{c.country}</span>
                      <span className="text-neutral-500">{c.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5">
                      <div className="bg-accent-500 h-1.5" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Pages */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Paginas mas vistas</h2>
          {analytics.pages.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-2">
              {analytics.pages.map((p, idx) => (
                <div key={p.page} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 truncate max-w-[250px] flex items-center gap-2">
                    <span className="text-xs text-neutral-400 w-5">{idx + 1}.</span>
                    <code className="text-xs">{p.page}</code>
                  </span>
                  <span className="text-neutral-500 font-medium">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Idiomas</h2>
          {analytics.locales.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-3">
              {analytics.locales.map((l) => {
                const pct = Math.round((l.count / analytics.monthViews) * 100);
                const label = l.locale === "es" ? "Espanol" : l.locale === "en" ? "English" : l.locale === "fr" ? "Francais" : l.locale;
                return (
                  <div key={l.locale}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-700">{label} ({l.locale.toUpperCase()})</span>
                      <span className="text-neutral-500">{pct}% ({l.count})</span>
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

        {/* Devices */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Dispositivos</h2>
          {analytics.devices.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun</p>
          ) : (
            <div className="space-y-4">
              {analytics.devices.map((d) => {
                const pct = Math.round((d.count / analytics.monthViews) * 100);
                const label = d.device === "desktop" ? "Escritorio" : d.device === "mobile" ? "Movil" : "Tablet";
                const Icon = deviceIcons[d.device] || Monitor;
                return (
                  <div key={d.device} className="flex items-center gap-3">
                    <Icon size={20} className="text-neutral-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700">{label}</span>
                        <span className="text-neutral-500">{pct}% ({d.count})</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2">
                        <div className="bg-accent-400 h-2" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Fuentes de trafico</h2>
          {analytics.referrers.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos aun (las visitas directas no tienen referrer)</p>
          ) : (
            <div className="space-y-2">
              {analytics.referrers.map((r) => (
                <div key={r.referrer} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 truncate max-w-[250px]">{r.referrer}</span>
                  <span className="text-neutral-500 font-medium">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Horas pico (ultima semana)</h2>
          <div className="flex items-end gap-[3px] h-32">
            {analytics.hourlyDistribution.map((count, hour) => {
              const maxHour = Math.max(...analytics.hourlyDistribution, 1);
              const height = (count / maxHour) * 100;
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-accent-300 hover:bg-accent-500 transition-colors min-h-[1px]"
                    style={{ height: `${Math.max(height, 1)}%` }}
                    title={`${hour}:00 - ${count} visitas`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>23h</span>
          </div>
        </div>

        {/* Top Clicks */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Elementos mas clicados</h2>
          {analytics.topClicks.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin datos de clics aun</p>
          ) : (
            <div className="space-y-2">
              {analytics.topClicks.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 truncate max-w-[250px]">{c.text}</span>
                  <span className="text-neutral-500 font-medium">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Types */}
        <div className="bg-white border border-neutral-200 p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Tipos de interaccion</h2>
          {analytics.eventsByType.length === 0 ? (
            <p className="text-sm text-neutral-400">Sin eventos registrados</p>
          ) : (
            <div className="space-y-2">
              {analytics.eventsByType.map((e) => {
                const labels: Record<string, string> = {
                  click: "Clics",
                  download: "Descargas",
                  form_submit: "Formularios",
                  dossier_download: "Dossiers",
                };
                return (
                  <div key={e.type} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{labels[e.type] || e.type}</span>
                    <span className="text-neutral-500 font-medium">{e.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Total historico */}
      <div className="bg-neutral-900 text-white p-6 text-center">
        <p className="text-sm text-neutral-400 mb-1">Total historico de visitas</p>
        <p className="text-4xl font-bold">{analytics.totalViews.toLocaleString("es-ES")}</p>
      </div>
    </div>
  );
}
