'use client';

import { useState, useRef, ChangeEvent } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number | string) =>
  n === "" || n === null || n === undefined
    ? "—"
    : Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const fmtN = (n: number | string) =>
  n === "" || n === null || n === undefined ? "" : Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const num = (v: any) => parseFloat(String(v).replace(/[,$]/g, "")) || 0;

// Parse a generic CSV (returns array of objects keyed by header row)
function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = vals[i] ?? ""));
    return obj;
  });
}

// Try to map common TradeLog column names to our schema
function mapTradeLogRow(row: any) {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const found = Object.keys(row).find(
        (rk) => rk.toLowerCase().replace(/[\s_-]/g, "") === k.toLowerCase().replace(/[\s_-]/g, "")
      );
      if (found && row[found] !== "") return row[found];
    }
    return "";
  };
  return {
    symbol: get("symbol", "ticker", "security", "description"),
    qty: get("quantity", "qty", "shares", "openqty"),
    basis: get("taxbasis", "costbasis", "basis", "adjustedbasis", "totalbasis"),
    fmv: get("fmv", "fairmarketvalue", "marketvalue", "closingvalue", "endvalue"),
  };
}

interface Position {
  symbol: string;
  qty: string;
  basis: string;
  fmv: string;
}

// Color theme - soft blue/gray palette with dark, readable text
const colors = {
  primary: "#2563eb",      // blue-600 - darker for better readability
  primaryLight: "#3b82f6", // blue-500
  primaryDark: "#1e40af",  // blue-700
  success: "#059669",      // emerald-600 - darker
  warning: "#d97706",      // amber-600 - darker
  danger: "#dc2626",       // red-600 - darker
  bg: "#f8fafc",           // slate-50
  bgCard: "#ffffff",       // white
  bgInput: "#f1f5f9",      // slate-100
  border: "#cbd5e1",       // slate-300 - darker border
  borderFocus: "#94a3b8",  // slate-400
  text: "#0f172a",         // slate-900 - much darker
  textLight: "#334155",    // slate-700 - much darker
  textMuted: "#475569",    // slate-600 - much darker
};

// ── sub-components ───────────────────────────────────────────────────────────
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'IBM Plex Mono', monospace",
        background: done ? colors.success : active ? colors.primary : colors.bgInput,
        color: done ? "white" : active ? "white" : colors.textMuted,
        border: `1.5px solid ${done ? colors.success : active ? colors.primary : colors.border}`,
        transition: "all 0.3s",
        flexShrink: 0,
      }}
    >
      {done ? "✓" : n}
    </div>
  );
}

function Field({ label, value, onChange, note, prefix = "$", readOnly = false }: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  note?: string;
  prefix?: string;
  readOnly?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: colors.primary, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4, letterSpacing: "0.04em", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {prefix && <span style={{ color: colors.textLight, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace" }}>{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          style={{
            background: readOnly ? colors.bgInput : colors.bgCard,
            border: `1px solid ${readOnly ? colors.border : colors.borderFocus}`,
            borderRadius: 6,
            color: readOnly ? colors.primary : colors.text,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            padding: "9px 12px",
            width: "100%",
            outline: "none",
            cursor: readOnly ? "default" : "text",
          }}
        />
      </div>
      {note && <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 3, fontFamily: "'IBM Plex Mono', monospace" }}>{note}</div>}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 18, borderBottom: `2px solid ${colors.border}`, paddingBottom: 10 }}>
      <div style={{ fontSize: 11, color: colors.primary, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
        {sub}
      </div>
      <div style={{ fontSize: 20, color: colors.text, fontWeight: 700, fontFamily: "'DM Serif Display', serif", marginTop: 4 }}>
        {title}
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight, indent = false, bold = false }: {
  label: string;
  value: number | string;
  highlight?: boolean;
  indent?: boolean;
  bold?: boolean;
}) {
  const isNeg = typeof value === "number" && value < 0;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        background: highlight ? "#dbeafe" : "transparent",
        borderRadius: 6,
        borderLeft: highlight ? `3px solid ${colors.primary}` : "none",
        marginBottom: 4,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: bold ? colors.text : colors.textLight,
          fontFamily: "'IBM Plex Mono', monospace",
          paddingLeft: indent ? 16 : 0,
          fontWeight: bold ? 600 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: bold ? 700 : 500,
          color: highlight ? colors.primary : isNeg ? colors.danger : colors.success,
        }}
      >
        {typeof value === "number" ? fmt(value) : value}
      </span>
    </div>
  );
}

// ── position table ────────────────────────────────────────────────────────────
function PositionTable({ rows, onChange, onAdd, onRemove, year }: {
  rows: Position[];
  onChange: (i: number, field: keyof Position, val: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  year: number | string;
}) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 90px 130px 130px 100px 28px",
          gap: 6,
          marginBottom: 6,
          padding: "0 4px",
        }}
      >
        {["Symbol / Description", "Qty", "Tax Basis ($)", `FMV @ 12/31/${year} ($)`, "Unrealized G/L", ""].map((h) => (
          <div key={h} style={{ fontSize: 11, color: colors.textLight, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em", fontWeight: 600 }}>
            {h}
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const basisN = num(r.basis);
        const fmvN = num(r.fmv);
        const gl = fmvN - basisN;
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 130px 130px 100px 28px",
              gap: 6,
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            {(["symbol", "qty", "basis", "fmv"] as const).map((field) => (
              <input
                key={field}
                value={r[field]}
                onChange={(e) => onChange(i, field, e.target.value)}
                placeholder={field === "symbol" ? "AAPL" : "0.00"}
                style={{
                  background: colors.bgCard,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: colors.text,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "7px 10px",
                  outline: "none",
                  width: "100%",
                }}
              />
            ))}
            <div
              style={{
                fontSize: 13,
                fontFamily: "'IBM Plex Mono', monospace",
                color: gl > 0 ? colors.success : gl < 0 ? colors.danger : colors.textMuted,
                textAlign: "right",
                paddingRight: 4,
                fontWeight: 600,
              }}
            >
              {r.basis || r.fmv ? fmt(gl) : "—"}
            </div>
            <button
              onClick={() => onRemove(i)}
              style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: 16, padding: 0 }}
            >
              ✕
            </button>
          </div>
        );
      })}
      <button
        onClick={onAdd}
        style={{
          marginTop: 10,
          background: "none",
          border: `2px dashed ${colors.border}`,
          borderRadius: 8,
          color: colors.primary,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          padding: "8px 16px",
          cursor: "pointer",
          letterSpacing: "0.02em",
          fontWeight: 600,
        }}
      >
        + Add Position
      </button>
    </div>
  );
}

// ── CSV Upload zone ───────────────────────────────────────────────────────────
function UploadZone({ label, onData }: { label: string; onData: (data: Position[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");

  const handle = (file: File | undefined) => {
    if (!file) return;
    setFilename(file.name);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rows = parseCSV(e.target?.result as string);
        const mapped = rows.map(mapTradeLogRow).filter((r) => r.symbol || r.basis || r.fmv);
        if (mapped.length === 0) {
          setError("No recognizable position data found. Please check column headers.");
          return;
        }
        onData(mapped);
      } catch {
        setError("Failed to parse CSV.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files[0]); }}
      onClick={() => ref.current?.click()}
      style={{
        border: `2px dashed ${colors.border}`,
        borderRadius: 8,
        padding: "18px 20px",
        cursor: "pointer",
        marginBottom: 16,
        background: colors.bgInput,
        transition: "all 0.2s",
      }}
    >
      <input ref={ref} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={(e) => handle(e.target.files?.[0])} />
      <div style={{ fontSize: 11, color: colors.primary, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: 13, color: filename ? colors.success : colors.textMuted, fontFamily: "'IBM Plex Mono', monospace", fontWeight: filename ? 600 : 400 }}>
        {filename || "Drag & drop CSV or click to browse"}
      </div>
      {error && <div style={{ fontSize: 11, color: colors.danger, marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{error}</div>}
    </div>
  );
}

// ── Paywall Component ─────────────────────────────────────────────────────────
function Paywall() {
  return (
    <div style={{ position: 'relative', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 500, background: colors.bgCard, padding: 40, borderRadius: 12, border: `2px solid ${colors.primary}`, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: colors.text, fontFamily: "'DM Serif Display', serif" }}>
          Premium Client Access Required
        </h3>
        <p style={{ fontSize: 14, color: colors.textLight, marginBottom: 24, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace" }}>
          The final reconciliation summary and export feature are available exclusively to our Annual Tax Planning clients.
          To access the complete MTM workpaper and receive professional tax guidance, please contact us.
        </p>
        <a
          href="/contact"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: colors.success,
            color: 'white',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: "'IBM Plex Mono', monospace",
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
          onMouseLeave={(e) => e.currentTarget.style.background = colors.success}
        >
          Become a Client
        </a>
      </div>
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────
export default function MTMWorkpaper({ isClient = false }: { isClient?: boolean }) {
  const [step, setStep] = useState(0);
  const [clientName, setClientName] = useState("");
  const [taxYear, setTaxYear] = useState("2025");
  const [electionConfirmed, setElectionConfirmed] = useState(false);
  const [spreadElection, setSpreadElection] = useState<"4year" | "1year">("4year");

  // Section 2 — 481(a) positions (12/31/2024)
  const [pos2024, setPos2024] = useState<Position[]>([{ symbol: "", qty: "", basis: "", fmv: "" }]);

  // Section 3 — 2025 MTM
  const [realizedGain, setRealizedGain] = useState("");
  const [pos2025, setPos2025] = useState<Position[]>([{ symbol: "", qty: "", basis: "", fmv: "" }]);

  // Preparer notes
  const [notes, setNotes] = useState("");

  const updatePos = (setter: React.Dispatch<React.SetStateAction<Position[]>>) => (i: number, field: keyof Position, val: string) =>
    setter((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  const addPos = (setter: React.Dispatch<React.SetStateAction<Position[]>>) => () => setter((prev) => [...prev, { symbol: "", qty: "", basis: "", fmv: "" }]);
  const removePos = (setter: React.Dispatch<React.SetStateAction<Position[]>>) => (i: number) => setter((prev) => prev.filter((_, idx) => idx !== i));

  // ── calculations ─────────────────────────────────────────────────────────
  const totalBasis2024 = pos2024.reduce((s, r) => s + num(r.basis), 0);
  const totalFMV2024 = pos2024.reduce((s, r) => s + num(r.fmv), 0);
  const adj481a = totalFMV2024 - totalBasis2024;

  const adj481aYear1 =
    spreadElection === "4year"
      ? adj481a >= 0
        ? adj481a / 4
        : adj481a // negative: all year 1
      : adj481a; // 1-year election

  const totalBasis2025 = pos2025.reduce((s, r) => s + num(r.basis), 0);
  const totalFMV2025 = pos2025.reduce((s, r) => s + num(r.fmv), 0);
  const yearEndMTM = totalFMV2025 - totalBasis2025;
  const realized = num(realizedGain);
  const totalMTMOrdinary = realized + yearEndMTM;
  const form4797Total = totalMTMOrdinary + adj481aYear1;

  const steps = [
    { title: "Election", subtitle: "First-year Mark-to-Market engagement · Section 481(a) adjustment required" },
    { title: `Section 481(a) adjustment — 12/31/${num(taxYear) - 1}`, subtitle: `Open positions @ 12/31/${num(taxYear) - 1}` },
    { title: `${taxYear} MTM gain/loss — current-year data`, subtitle: "Year-end positions and realized activity" },
    { title: "Return & workpaper tie-out", subtitle: "Form 4797 summary and documentation" }
  ];

  const canProceed = [
    clientName.trim() !== "" && electionConfirmed,
    pos2024.some((r) => r.basis || r.fmv),
    pos2025.some((r) => r.basis || r.fmv) || realizedGain !== "",
    true,
  ];

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus, input:focus { box-shadow: 0 0 0 2px ${colors.primary}40 !important; border-color: ${colors.primary} !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${colors.bgInput}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.borderFocus}; }
      `}</style>

      <div style={{ background: colors.bg, minHeight: "100vh", padding: "28px 20px", fontFamily: "'IBM Plex Mono', monospace" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: colors.primary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            IRC §475(f) · Mark-to-Market Estimator
          </div>
          <div style={{ fontSize: 28, color: colors.text, fontFamily: "'DM Serif Display', serif", lineHeight: 1.2, fontWeight: 700 }}>
            MTM Reconciliation Workpaper (Estimate)
          </div>
          <div style={{ fontSize: 13, color: colors.textLight, marginTop: 6 }}>
            Section 481(a) Adjustment · Year-End MTM · Form 4797 Summary
          </div>
          <div style={{ fontSize: 12, color: colors.warning, marginTop: 8, fontWeight: 600, padding: "8px 12px", background: "#fef3c7", borderRadius: 6, border: "1px solid #fbbf24" }}>
            ⚠️ This is an estimate tool. Final filing accuracy must be verified by the taxpayer.
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                background: step === i ? "#3b4d7d" : canProceed[i] && i < step ? "#4c6187" : "#6b7fa8",
                border: "none",
                borderRadius: 8,
                padding: "14px 18px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s",
                opacity: step === i ? 1 : 0.85,
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "white", fontWeight: 600, marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {i + 1} · {s.title}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {s.subtitle}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", minWidth: 40, textAlign: "right" }}>
                {canProceed[i] ? "✓" : `${i + 1}`}
              </div>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "28px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>

          {/* Step 0: Client & Election */}
          {step === 0 && (
            <div>
              <SectionHeader title="Client Information & Election Verification" sub="Step 1 of 4" />
              <Field label="CLIENT NAME / ENTITY" value={clientName} onChange={(e) => setClientName(e.target.value)} prefix="" note="As it appears on the return" />
              <Field label="TAX YEAR" value={taxYear} onChange={(e) => setTaxYear(e.target.value)} prefix="" note="First effective MTM year" />

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: colors.primary, marginBottom: 10, letterSpacing: "0.04em", fontWeight: 700 }}>ELECTION CHECKLIST</div>
                {[
                  "IRC §475(f) election statement filed with prior-year return",
                  "Election statement timely filed (by due date / extension of prior return)",
                  "Taxpayer qualifies as trader in securities (not investor)",
                  "Open position report as of 12/31/prior year obtained from broker",
                  "1099-B and supplemental basis schedule obtained for current year",
                ].map((item, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                    <input type="checkbox" style={{ marginTop: 2, accentColor: colors.primary }} />
                    <span style={{ fontSize: 12, color: colors.text, lineHeight: 1.5, fontWeight: 600 }}>{item}</span>
                  </label>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 20 }}>
                <input
                  type="checkbox"
                  checked={electionConfirmed}
                  onChange={(e) => setElectionConfirmed(e.target.checked)}
                  style={{ accentColor: colors.primary }}
                />
                <span style={{ fontSize: 12, color: colors.text, fontWeight: 700 }}>
                  Election validity confirmed — proceed with MTM workpaper
                </span>
              </label>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: colors.primary, marginBottom: 8, letterSpacing: "0.04em", fontWeight: 700 }}>
                  481(a) SPREAD ELECTION
                </div>
                {([["4year", "4-year ratable inclusion (default, Rev. Proc. 2015-13)"], ["1year", "1-year inclusion (taxpayer elects acceleration)"]] as const).map(
                  ([val, label]) => (
                    <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="spread"
                        value={val}
                        checked={spreadElection === val}
                        onChange={() => setSpreadElection(val)}
                        style={{ accentColor: colors.primary }}
                      />
                      <span style={{ fontSize: 12, color: colors.text, fontWeight: 600 }}>{label}</span>
                    </label>
                  )
                )}
                <div style={{ fontSize: 10, color: colors.textLight, marginTop: 4, fontWeight: 600 }}>
                  Note: Negative 481(a) adjustment is always taken entirely in Year 1 regardless of election.
                </div>
              </div>
            </div>
          )}

          {/* Step 1: 481(a) Positions */}
          {step === 1 && (
            <div>
              <SectionHeader
                title={`Section 481(a) — Open Positions @ 12/31/${num(taxYear) - 1}`}
                sub="Step 2 of 4 · Prior-year positions"
              />
              <div style={{ fontSize: 11, color: "#3d6b4f", marginBottom: 14, lineHeight: 1.6 }}>
                Enter open positions held immediately before MTM election became effective.
                Basis = adjusted tax basis per IRS rules (not broker cost basis).
                Upload TradeLog open position CSV or enter manually.
              </div>

              <UploadZone
                label="UPLOAD TRADELOG OPEN POSITION CSV — 12/31 PRIOR YEAR"
                onData={(rows) => setPos2024(rows)}
              />

              <PositionTable
                rows={pos2024}
                onChange={updatePos(setPos2024)}
                onAdd={addPos(setPos2024)}
                onRemove={removePos(setPos2024)}
                year={num(taxYear) - 1}
              />

              <div style={{ borderTop: "1px solid #1a3a2a", marginTop: 16, paddingTop: 14 }}>
                <ResultRow label={`Total tax basis (12/31/${num(taxYear) - 1})`} value={totalBasis2024} />
                <ResultRow label={`Total FMV (12/31/${num(taxYear) - 1})`} value={totalFMV2024} />
                <ResultRow
                  label="Section 481(a) Adjustment"
                  value={adj481a}
                  highlight
                  bold
                />
                <div style={{ fontSize: 10, color: "#3d5a45", marginTop: 8 }}>
                  {adj481a >= 0
                    ? `Positive adjustment → ordinary income. Year 1 inclusion: ${fmt(adj481aYear1)} (${spreadElection === "4year" ? "25% of 4-year spread" : "full 1-year election"})`
                    : `Negative adjustment → ordinary loss ${fmt(adj481a)} taken entirely in Year 1.`}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 2025 MTM */}
          {step === 2 && (
            <div>
              <SectionHeader
                title={`${taxYear} MTM Ordinary Gain / Loss`}
                sub="Step 3 of 4 · Current-year MTM"
              />
              <div style={{ fontSize: 11, color: "#3d6b4f", marginBottom: 14, lineHeight: 1.6 }}>
                Enter realized activity from TradeLog gain/loss report, then year-end open positions for the MTM adjustment.
              </div>

              <Field
                label={`TOTAL REALIZED GAIN/LOSS — ${taxYear} (from TradeLog G/L Report)`}
                value={realizedGain}
                onChange={(e) => setRealizedGain(e.target.value)}
                note="Net realized gain/loss on all closed positions during the tax year"
              />

              <div style={{ fontSize: 11, color: "#6b9e7e", marginBottom: 10, marginTop: 4, letterSpacing: "0.04em" }}>
                OPEN POSITIONS @ 12/31/{taxYear} — YEAR-END MTM ADJUSTMENT
              </div>

              <UploadZone
                label={`UPLOAD TRADELOG OPEN POSITION CSV — 12/31/${taxYear}`}
                onData={(rows) => setPos2025(rows)}
              />

              <PositionTable
                rows={pos2025}
                onChange={updatePos(setPos2025)}
                onAdd={addPos(setPos2025)}
                onRemove={removePos(setPos2025)}
                year={taxYear}
              />

              <div style={{ borderTop: "1px solid #1a3a2a", marginTop: 16, paddingTop: 14 }}>
                <ResultRow label="Realized gain/loss (closed positions)" value={realized} />
                <ResultRow label={`Total basis — open positions (12/31/${taxYear})`} value={totalBasis2025} indent />
                <ResultRow label={`Total FMV — open positions (12/31/${taxYear})`} value={totalFMV2025} indent />
                <ResultRow label="Year-end MTM adjustment (unrealized)" value={yearEndMTM} indent />
                <ResultRow
                  label={`Total ${taxYear} MTM Ordinary Gain/Loss`}
                  value={totalMTMOrdinary}
                  highlight
                  bold
                />
              </div>
            </div>
          )}

          {/* Step 3: Summary & Form 4797 */}
          {step === 3 && !isClient && (
            <div>
              <SectionHeader
                title="Reconciliation Summary — Form 4797 Part II"
                sub="Step 4 of 4 · Workpaper output"
              />
              <Paywall />
            </div>
          )}

          {step === 3 && isClient && (
            <div>
              <SectionHeader
                title="Reconciliation Summary — Form 4797 Part II"
                sub="Step 4 of 4 · Workpaper output"
              />

              {/* Client header */}
              <div
                style={{
                  background: "#080e09",
                  border: "1px solid #1a3a2a",
                  borderRadius: 6,
                  padding: "12px 14px",
                  marginBottom: 18,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  ["Client", clientName || "—"],
                  ["Tax Year", taxYear],
                  ["First MTM Year", "Yes — §481(a) applies"],
                  ["481(a) Spread", spreadElection === "4year" ? "4-year ratable" : "1-year election"],
                  ["Election Confirmed", electionConfirmed ? "✓ Yes" : "⚠ Not confirmed"],
                  ["Preparer", "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: "#2d6a4f", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 12, color: "#b8dcc4" }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* 481(a) block */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#6b9e7e", marginBottom: 8, letterSpacing: "0.06em" }}>
                  A · SECTION 481(a) ADJUSTMENT (CONVERSION ADJUSTMENT)
                </div>
                <ResultRow label={`FMV — open positions (12/31/${num(taxYear) - 1})`} value={totalFMV2024} indent />
                <ResultRow label={`Tax basis — open positions (12/31/${num(taxYear) - 1})`} value={totalBasis2024} indent />
                <ResultRow label="Total 481(a) adjustment" value={adj481a} bold />
                <ResultRow
                  label={`Year 1 481(a) inclusion (${taxYear})`}
                  value={adj481aYear1}
                  highlight
                  bold
                />
              </div>

              {/* MTM block */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#6b9e7e", marginBottom: 8, letterSpacing: "0.06em" }}>
                  B · {taxYear} MTM ORDINARY GAIN / LOSS
                </div>
                <ResultRow label={`Realized gain/loss — closed positions (${taxYear})`} value={realized} indent />
                <ResultRow label={`FMV — open positions (12/31/${taxYear})`} value={totalFMV2025} indent />
                <ResultRow label={`Tax basis — open positions (12/31/${taxYear})`} value={totalBasis2025} indent />
                <ResultRow label="Year-end MTM adjustment" value={yearEndMTM} indent />
                <ResultRow label={`Total ${taxYear} MTM ordinary gain/loss`} value={totalMTMOrdinary} bold />
              </div>

              {/* Form 4797 summary */}
              <div
                style={{
                  background: "#050c06",
                  border: "1px solid #2d6a4f55",
                  borderRadius: 6,
                  padding: "14px",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 11, color: "#52b788", marginBottom: 10, letterSpacing: "0.08em" }}>
                  FORM 4797 PART II — ORDINARY GAINS AND LOSSES
                </div>
                <ResultRow label={`Line: ${taxYear} MTM gain/loss (B above)`} value={totalMTMOrdinary} />
                <ResultRow label="Line: §481(a) — Year 1 inclusion (A above)" value={adj481aYear1} />
                <div style={{ height: 1, background: "#1a3a2a", margin: "8px 0" }} />
                <ResultRow
                  label={`Total ordinary income / (loss) — Form 4797 Pt. II`}
                  value={form4797Total}
                  highlight
                  bold
                />
                {spreadElection === "4year" && adj481a > 0 && (
                  <div style={{ fontSize: 10, color: "#3d6b4f", marginTop: 8, lineHeight: 1.6 }}>
                    Remaining 481(a) balance: {fmt(adj481a - adj481aYear1)} to be included ratably over Years 2–4.
                  </div>
                )}
              </div>

              {/* Preparer notes */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#6b9e7e", marginBottom: 6, letterSpacing: "0.04em" }}>PREPARER NOTES</div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add review notes, open items, client-specific issues..."
                  rows={4}
                  style={{
                    width: "100%",
                    background: "#0a120b",
                    border: "1px solid #1e3a2a",
                    borderRadius: 4,
                    color: "#7eab8a",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    padding: "8px 10px",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Warnings */}
              {!electionConfirmed && (
                <div style={{ background: "#1a0a0a", border: "1px solid #5a2020", borderRadius: 6, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#e07070", fontWeight: 600 }}>⚠ Election not confirmed</div>
                  <div style={{ fontSize: 11, color: "#a06060", marginTop: 3 }}>
                    Return to Step 1 and confirm the §475(f) election is valid before filing.
                  </div>
                </div>
              )}
              {form4797Total !== 0 && (
                <div style={{ background: "#080e09", border: "1px solid #1a3a2a", borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#52b788", fontWeight: 600, marginBottom: 4 }}>Filing reminders</div>
                  {[
                    "Form 4797 Part II — report total MTM ordinary gain/loss",
                    "Form 3115 — required to report §481(a) accounting method change",
                    spreadElection === "4year" && adj481a > 0
                      ? `481(a) spread schedule — track remaining ${fmt(adj481a - adj481aYear1)} over 3 subsequent years`
                      : null,
                    "Wash sale adjustments on 1099-B should be reversed (§475 traders exempt from §1091)",
                    "No Schedule D / Form 8949 for MTM positions — all ordinary via Form 4797",
                  ]
                    .filter(Boolean)
                    .map((r, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#3d6b4f", marginTop: 4, paddingLeft: 10, borderLeft: "1px solid #2d6a4f33" }}>
                        {r}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              background: step === 0 ? colors.bgInput : colors.bgCard,
              border: `2px solid ${step === 0 ? colors.border : colors.primary}`,
              borderRadius: 8,
              color: step === 0 ? colors.textMuted : colors.primary,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              padding: "10px 20px",
              cursor: step === 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            ← Back
          </button>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            {clientName && <span style={{ color: colors.text, fontWeight: 600 }}>{clientName} · </span>}
            {taxYear}
          </div>
          {step < 3 ? (
            step === 2 && !isClient ? (
              <a
                href="/contact"
                style={{
                  background: colors.success,
                  border: `2px solid ${colors.success}`,
                  borderRadius: 8,
                  color: "white",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block"
                }}
              >
                Unlock Final Summary →
              </a>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(3, s + 1))}
                disabled={step === 2 && !isClient}
                style={{
                  background: (step === 2 && !isClient) ? colors.bgInput : colors.primary,
                  border: `2px solid ${(step === 2 && !isClient) ? colors.border : colors.primary}`,
                  borderRadius: 8,
                  color: (step === 2 && !isClient) ? colors.textMuted : "white",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "10px 20px",
                  cursor: (step === 2 && !isClient) ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                Next →
              </button>
            )
          ) : (
            isClient ? (
              <button
                onClick={() => window.print()}
                style={{
                  background: colors.success,
                  border: `2px solid ${colors.success}`,
                  borderRadius: 8,
                  color: "white",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Print / Export
              </button>
            ) : (
              <a
                href="/contact"
                style={{
                  background: colors.success,
                  border: `2px solid ${colors.success}`,
                  borderRadius: 8,
                  color: "white",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block"
                }}
              >
                Become a Client
              </a>
            )
          )}
        </div>
      </div>
    </>
  );
}
