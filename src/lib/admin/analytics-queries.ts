import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsSummary() {
  const supabase = await createClient();

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalViews,
    todayViews,
    weekViews,
    monthViews,
    uniqueSessions,
    viewsByCountry,
    viewsByLocale,
    viewsByDevice,
    viewsByPage,
    topReferrers,
    recentEvents,
    newVsReturning,
    hourlyDistribution,
  ] = await Promise.all([
    // Total views all time
    supabase.from("page_views").select("id", { count: "exact", head: true }),

    // Today views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`),

    // Week views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),

    // Month views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthAgo),

    // Unique sessions (month)
    supabase
      .from("page_views")
      .select("session_id")
      .gte("created_at", monthAgo),

    // Views by country (top 10)
    supabase
      .from("page_views")
      .select("country")
      .gte("created_at", monthAgo)
      .not("country", "is", null),

    // Views by locale
    supabase
      .from("page_views")
      .select("locale")
      .gte("created_at", monthAgo)
      .not("locale", "is", null),

    // Views by device
    supabase
      .from("page_views")
      .select("device_type")
      .gte("created_at", monthAgo)
      .not("device_type", "is", null),

    // Top pages
    supabase
      .from("page_views")
      .select("page_path")
      .gte("created_at", monthAgo),

    // Top referrers
    supabase
      .from("page_views")
      .select("referrer")
      .gte("created_at", monthAgo)
      .not("referrer", "is", null)
      .neq("referrer", ""),

    // Recent events
    supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),

    // New vs returning
    supabase
      .from("page_views")
      .select("is_new_visitor")
      .gte("created_at", monthAgo),

    // Hourly distribution
    supabase
      .from("page_views")
      .select("created_at")
      .gte("created_at", weekAgo),
  ]);

  // Aggregate country counts
  const countryMap = new Map<string, number>();
  viewsByCountry.data?.forEach((row) => {
    const c = row.country || "Desconocido";
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
  });
  const countries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Aggregate locale counts
  const localeMap = new Map<string, number>();
  viewsByLocale.data?.forEach((row) => {
    const l = row.locale || "?";
    localeMap.set(l, (localeMap.get(l) || 0) + 1);
  });
  const locales = Array.from(localeMap.entries())
    .map(([locale, count]) => ({ locale, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate device counts
  const deviceMap = new Map<string, number>();
  viewsByDevice.data?.forEach((row) => {
    const d = row.device_type || "unknown";
    deviceMap.set(d, (deviceMap.get(d) || 0) + 1);
  });
  const devices = Array.from(deviceMap.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate page counts
  const pageMap = new Map<string, number>();
  viewsByPage.data?.forEach((row) => {
    const p = row.page_path || "/";
    pageMap.set(p, (pageMap.get(p) || 0) + 1);
  });
  const pages = Array.from(pageMap.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Aggregate referrer counts
  const referrerMap = new Map<string, number>();
  topReferrers.data?.forEach((row) => {
    try {
      const hostname = new URL(row.referrer).hostname;
      referrerMap.set(hostname, (referrerMap.get(hostname) || 0) + 1);
    } catch {
      referrerMap.set(row.referrer, (referrerMap.get(row.referrer) || 0) + 1);
    }
  });
  const referrers = Array.from(referrerMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Unique sessions count
  const sessionSet = new Set(uniqueSessions.data?.map((r) => r.session_id));

  // New vs returning
  let newVisitors = 0;
  let returningVisitors = 0;
  newVsReturning.data?.forEach((row) => {
    if (row.is_new_visitor) newVisitors++;
    else returningVisitors++;
  });

  // Hourly distribution
  const hours = new Array(24).fill(0);
  hourlyDistribution.data?.forEach((row) => {
    const h = new Date(row.created_at).getHours();
    hours[h]++;
  });

  // Aggregate events by type
  const eventMap = new Map<string, number>();
  recentEvents.data?.forEach((row) => {
    eventMap.set(row.event_type, (eventMap.get(row.event_type) || 0) + 1);
  });
  const eventsByType = Array.from(eventMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Most clicked elements
  const clickMap = new Map<string, { text: string; count: number }>();
  recentEvents.data
    ?.filter((e) => e.event_type === "click")
    .forEach((row) => {
      const key = row.element_id || row.element_text || "unknown";
      const existing = clickMap.get(key);
      if (existing) existing.count++;
      else clickMap.set(key, { text: row.element_text || key, count: 1 });
    });
  const topClicks = Array.from(clickMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalViews: totalViews.count || 0,
    todayViews: todayViews.count || 0,
    weekViews: weekViews.count || 0,
    monthViews: monthViews.count || 0,
    uniqueVisitors: sessionSet.size,
    countries,
    locales,
    devices,
    pages,
    referrers,
    eventsByType,
    topClicks,
    newVisitors,
    returningVisitors,
    hourlyDistribution: hours,
    recentEvents: recentEvents.data || [],
  };
}

export async function getDailyViews(days: number = 30) {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from("page_views")
    .select("created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  const dailyMap = new Map<string, number>();
  data?.forEach((row) => {
    const day = row.created_at.split("T")[0];
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
  });

  // Fill missing days with 0
  const result: { date: string; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    result.push({ date: dateStr, views: dailyMap.get(dateStr) || 0 });
  }

  return result;
}

export async function getContentCounts() {
  const supabase = await createClient();

  const [projects, exhibitions, news, books, collaborators, downloads] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("exhibitions").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase.from("books").select("id", { count: "exact", head: true }),
    supabase.from("collaborators").select("id", { count: "exact", head: true }),
    supabase.from("book_downloads").select("id", { count: "exact", head: true }),
  ]);

  return {
    projects: projects.count || 0,
    exhibitions: exhibitions.count || 0,
    news: news.count || 0,
    books: books.count || 0,
    collaborators: collaborators.count || 0,
    downloads: downloads.count || 0,
  };
}
