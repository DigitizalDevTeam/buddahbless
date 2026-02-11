import { useState, useEffect } from "react";

export function OfflineBanner() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-amber-600 text-black text-center py-2 px-4 text-sm font-medium"
      role="status"
      aria-live="polite"
    >
      You’re offline. Some features may be unavailable.
    </div>
  );
}
