"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("rv_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("rv_session", id);
  }
  return id;
}

function isNewVisitor(): boolean {
  if (typeof window === "undefined") return true;
  const visited = localStorage.getItem("rv_visited");
  if (!visited) {
    localStorage.setItem("rv_visited", "1");
    return true;
  }
  return false;
}

export function PageTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const sessionId = getSessionId();

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        page_path: pathname,
        locale,
        referrer: document.referrer || null,
        session_id: sessionId,
        is_new_visitor: isNewVisitor(),
      }),
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}

export function trackEvent(
  eventType: "click" | "download" | "form_submit" | "dossier_download",
  elementId: string,
  elementText: string,
  pagePath?: string,
  metadata?: Record<string, unknown>
) {
  const sessionId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("rv_session") || ""
      : "";

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "event",
      event_type: eventType,
      element_id: elementId,
      element_text: elementText,
      page_path: pagePath || window.location.pathname,
      session_id: sessionId,
      metadata,
    }),
  }).catch(() => {});
}
