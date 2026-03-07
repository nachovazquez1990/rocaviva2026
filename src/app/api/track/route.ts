import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function getDeviceType(ua: string): "mobile" | "tablet" | "desktop" {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, page_path, locale, referrer, session_id, element_id, element_text, metadata } = body;

    const supabase = createAdminClient();
    const ua = request.headers.get("user-agent") || "";
    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

    if (type === "pageview") {
      await supabase.from("page_views").insert({
        page_path,
        locale,
        country,
        city,
        referrer: referrer || null,
        user_agent: ua,
        device_type: getDeviceType(ua),
        session_id,
        is_new_visitor: body.is_new_visitor ?? true,
      });
    } else if (type === "event") {
      await supabase.from("analytics_events").insert({
        event_type: body.event_type,
        element_id,
        element_text,
        page_path,
        metadata: metadata || null,
        session_id,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
