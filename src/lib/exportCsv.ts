import { supabase } from "@/integrations/supabase/client";

const TABLES = ["cliniques", "patients", "passages", "actes", "appointments"] as const;

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

function download(name: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportAllCsv(): Promise<number> {
  const date = new Date().toISOString().slice(0, 10);
  let count = 0;
  for (const t of TABLES) {
    const { data, error } = await supabase.from(t).select("*").order("created_at");
    if (error) throw error;
    if (!data?.length) continue;
    download(`${t}_${date}.csv`, toCsv(data as Record<string, unknown>[]));
    count++;
    await new Promise((r) => setTimeout(r, 400));
  }
  return count;
}
