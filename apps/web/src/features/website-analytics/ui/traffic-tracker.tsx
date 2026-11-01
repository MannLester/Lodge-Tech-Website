"use client";
import { useEffect, useState } from "react";
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
    return null;
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
  const [choice, setChoice] = useState<string | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    subscribers.add(setChoice);
    const c = read(consentKey);
    queueMicrotask(() => {
      setChoice(c);
      setOpen(c === null);
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
        if (e.key === consentKey && e.newValue !== "granted") {
          stop(true);
          subscribers.forEach((fn) => fn(e.newValue));
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
  }, []);
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
  if (!publicPaths.includes(pathname)) return null;
  return (
    <aside className="fixed bottom-3 left-3 z-50 max-w-sm rounded-xl border bg-white p-4 text-sm text-slate-900 shadow-lg">
      {open ? (
        <>
          <p>
            Allow first-party visit analytics? We measure campaign sources,
            pages viewed, and estimated foreground viewing time. No form
            contents are collected. You can withdraw here at any time.
          </p>
          <div className="mt-3 flex gap-4">
            <button onClick={() => choose("granted")}>Allow analytics</button>
            <button onClick={() => choose("denied")}>Decline / withdraw</button>
          </div>
        </>
      ) : (
        <button onClick={() => setOpen(true)}>
          Analytics privacy settings
        </button>
      )}
    </aside>
  );
}
