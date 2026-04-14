import { useEffect } from "react";

export const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";
export const areaClass = `${inputClass} min-h-[96px] resize-y`;
export const panelClass = "rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm";
export const mutedLabelClass = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

export const fromLines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
export const toLines = (value: string[]) => value.join("\n");
export const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return undefined;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}
