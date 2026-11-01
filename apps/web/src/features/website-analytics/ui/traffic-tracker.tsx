"use client";
import { useEffect, useId, useState } from "react";
import { BarChart3, Settings2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  attribution,
  engagementDelta,
  publicPaths,
  type Snapshot,
} from "@/features/website-analytics/model/traffic";
const key = "lt.analytics.session",
  consentKey = "lt.analytics.consent";
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return undefined;
  }
};
type Session = {
  id: string;
  start: string;
  last: number;
  landing: string;
  attribution: Snapshot["attribution"];
};
let session: Session | null = null,
  snapshot: Snapshot | null = null,
  permitted = false,
  last = 0,
  lastWall = 0,
  eligible = false,
  path = "",
  timer: ReturnType<typeof setInterval> | undefined;
let release: (() => void) | undefined,
  generation = 0;
const timeout = Number(process.env.NEXT_PUBLIC_ANALYTICS_TIMEOUT_MS ?? 1800000);
const subscribers = new Set<(value: string | null) => void>();
let detach: (() => void) | undefined;
function save() {
  try {
    sessionStorage.setItem(key, JSON.stringify(session));
  } catch {
    /* Memory continuity only. */
  }
}
function send() {
  if (!permitted || !snapshot) return;
  const body = JSON.stringify(snapshot);
  try {
    if (
      navigator.sendBeacon?.(
        "/api/analytics/collect",
        new Blob([body], { type: "application/json" }),
      )
    )
      return;
  } catch {
    /* Fall back. */
  }
  void fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
function newPage() {
  if (!session) return;
  snapshot = {
    session_id: session.id,
    page_view_id: crypto.randomUUID(),
    started_at: session.start,
    observed_at: new Date().toISOString(),
    page_observed_at: new Date().toISOString(),
    page_path: path,
    landing_page: session.landing,
    engagement_time_ms: 0,
    attribution: session.attribution,
  };
}
function fresh() {
  release?.();
  release = undefined;
  const now = Date.now();
  session = {
    id: crypto.randomUUID(),
    start: new Date(now).toISOString(),
    last: now,
    landing: path,
    attribution: attribution(new URL(location.href), document.referrer, [
      location.hostname,
      new URL(process.env.NEXT_PUBLIC_SITE_URL ?? location.origin).hostname,
    ]),
  };
  save();
  newPage();
  if (navigator.locks) {
    const id = session.id;
    void navigator.locks
      .request(`lt-analytics-${id}`, async () => {
        if (!permitted || session?.id !== id) return;
        await new Promise<void>((done) => {
          release = done;
        });
      })
      .catch(() => {});
  }
}
function tick() {
  const current = performance.now(),
    now = Date.now();
  const can =
    document.visibilityState === "visible" &&
    document.hasFocus() &&
    publicPaths.includes(path);
  if (can && session && now - session.last >= timeout) {
    fresh();
    eligible = false;
  }
  if (snapshot && session && eligible) {
    const delta = engagementDelta(
      current - last,
      now - lastWall <= 5000 && now >= lastWall,
    );
    snapshot.engagement_time_ms += Math.floor(delta);
    if (delta > 0) {
      snapshot.observed_at = new Date(now).toISOString();
      session.last = now;
      save();
    }
  }
  last = current;
  lastWall = now;
  eligible = can;
}
function stop(clear = false) {
  permitted = false;
  generation++;
  if (timer) clearInterval(timer);
  timer = undefined;
  release?.();
  release = undefined;
  snapshot = null;
  session = null;
  try {
    if (clear) sessionStorage.removeItem(key);
  } catch {
    /* Storage blocked. */
  }
}
async function start() {
  if (permitted) return;
  permitted = true;
  const token = ++generation;
  try {
    session = JSON.parse(
      sessionStorage.getItem(key) ?? "null",
    ) as Session | null;
  } catch {
    session = null;
  }
  if (
    !session ||
    typeof session.last !== "number" ||
    Date.now() - session.last >= timeout
  )
    session = null;
  if (session && navigator.locks) {
    const id = session.id;
    await new Promise<void>((resolve) => {
      void navigator.locks.request(
        `lt-analytics-${id}`,
        { ifAvailable: true },
        async (lock) => {
          if (!lock) session = null;
          resolve();
          if (lock)
            await new Promise<void>((done) => {
              release = done;
            });
        },
      );
    });
  } else session = null;
  if (token !== generation || !permitted) {
    release?.();
    return;
  }
  if (!session) {
    fresh();
  } else newPage();
  last = performance.now();
  lastWall = Date.now();
  eligible = document.visibilityState === "visible" && document.hasFocus();
  send();
  let elapsed = 0;
  timer = setInterval(() => {
    tick();
    elapsed += 1000;
    if (
      elapsed >= Number(process.env.NEXT_PUBLIC_ANALYTICS_HEARTBEAT_MS ?? 15000)
    ) {
      elapsed = 0;
      if (eligible) send();
    }
  }, 1000);
}
export function TrafficTracker() {
  const pathname = usePathname();
  const automatic =
    process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_MODE === "opt-out";
  const headingId = useId();
  const [choice, setChoice] = useState<string | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    subscribers.add(setChoice);
    const c = read(consentKey);
    // Preserve explicit choices when changing policy. If preference storage is
    // blocked, fail closed so an opt-out cannot be silently lost on refresh.
    const initial =
      c === "granted" || c === "denied"
        ? c
        : automatic
          ? c === undefined
            ? "denied"
            : "granted"
          : null;
    queueMicrotask(() => {
      setChoice(initial);
      setOpen(!automatic && initial === null);
    });
    if (!detach) {
      const handle = () => {
        tick();
        send();
      };
      const restore = () => {
        last = performance.now();
        lastWall = Date.now();
        eligible = false;
      };
      const storage = (e: StorageEvent) => {
        if (
          (e.key === consentKey && e.newValue !== "granted") ||
          e.key === null
        ) {
          stop(true);
          subscribers.forEach((fn) => fn("denied"));
        }
      };
      window.addEventListener("storage", storage);
      window.addEventListener("blur", handle);
      window.addEventListener("focus", restore);
      document.addEventListener("visibilitychange", handle);
      window.addEventListener("pagehide", handle);
      window.addEventListener("pageshow", restore);
      detach = () => {
        window.removeEventListener("storage", storage);
        window.removeEventListener("blur", handle);
        window.removeEventListener("focus", restore);
        document.removeEventListener("visibilitychange", handle);
        window.removeEventListener("pagehide", handle);
        window.removeEventListener("pageshow", restore);
      };
    }
    return () => {
      subscribers.delete(setChoice);
      if (!subscribers.size) {
        detach?.();
        detach = undefined;
        stop();
      }
    };
  }, [automatic]);
  useEffect(() => {
    if (choice === undefined) return;
    if (path !== pathname) {
      if (session && Date.now() - session.last >= timeout) stop();
      else {
        tick();
        send();
      }
      path = pathname;
      snapshot = null;
      if (session && publicPaths.includes(path)) {
        session.last = Date.now();
        save();
        newPage();
        send();
      }
    }
    if (choice === "granted" && publicPaths.includes(path))
      void start().catch(() => stop());
    else stop(choice !== "granted");
  }, [pathname, choice]);
  function choose(value: string) {
    if (value !== "granted") stop(true);
    try {
      localStorage.setItem(consentKey, value);
    } catch {
      /* Preference lasts for this page only. */
    }
    setChoice(value);
    setOpen(false);
  }
  if (!publicPaths.includes(pathname) || choice === undefined) return null;
  return (
    <aside
      aria-label="Website analytics preferences"
      className={`border-border bg-surface text-foreground fixed inset-x-4 bottom-4 z-50 rounded-xl border shadow-[0_8px_40px_rgba(0,0,0,0.22)] sm:right-6 sm:left-auto ${open ? "max-w-md p-5 sm:p-6" : "p-3"}`}
    >
      {open ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-brand-soft text-brand-strong rounded-lg p-2">
                <BarChart3 aria-hidden="true" className="size-5" />
              </span>
              <h2 id={headingId} className="text-lg font-bold">
                Website visit analytics
              </h2>
            </div>
            <button
              aria-label="Close analytics settings"
              className="hover:bg-surface-muted focus-visible:outline-brand -mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-md"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <p className="text-muted mt-4 text-sm leading-6">
            {automatic
              ? "We measure traffic sources, pages viewed, and foreground viewing time to improve this website."
              : "May we measure traffic sources, pages viewed, and foreground viewing time to improve this website?"}{" "}
            These first-party analytics do not record form contents.
          </p>
          <p className="text-muted mt-2 text-xs leading-5">
            You can turn this off at any time. This setting applies to our
            first-party visit measurements.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand min-h-12 rounded-md px-4 py-3 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() =>
                choose(choice === "granted" ? "denied" : "granted")
              }
            >
              {choice === "granted"
                ? "Turn off analytics"
                : automatic
                  ? "Turn on analytics"
                  : "Allow analytics"}
            </button>
            <button
              className="border-border hover:bg-surface-muted focus-visible:outline-brand min-h-12 rounded-md border px-4 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() =>
                choice === null ? choose("denied") : setOpen(false)
              }
            >
              {choice === null ? "Decline analytics" : "Close settings"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${choice === "granted" ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            Visit analytics: {choice === "granted" ? "On" : "Off"}
          </span>
          <button
            aria-label={
              choice === "granted" ? "Turn off analytics" : "Turn on analytics"
            }
            className="bg-brand-fill hover:bg-brand-strong focus-visible:outline-brand min-h-11 rounded-md px-4 py-2 text-xs font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => choose(choice === "granted" ? "denied" : "granted")}
          >
            {choice === "granted" ? "Turn off" : "Turn on"}
          </button>
          <button
            aria-label="Analytics privacy settings"
            className="border-border hover:bg-surface-muted focus-visible:outline-brand inline-flex size-11 shrink-0 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => setOpen(true)}
          >
            <Settings2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
