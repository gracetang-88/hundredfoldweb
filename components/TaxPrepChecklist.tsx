'use client';

import { useState } from 'react';

// Color theme matching MTM workpaper
const colors = {
  primary: "#2563eb",
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
  bg: "#f8fafc",
  bgCard: "#ffffff",
  border: "#cbd5e1",
  text: "#0f172a",
  textLight: "#334155",
  textMuted: "#475569",
};

interface ChecklistItem {
  id: string;
  label: string;
  note: string;
  checked: boolean;
}

interface ChecklistSection {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  items: ChecklistItem[];
  noteBox?: {
    type: 'info' | 'warn' | 'danger';
    title: string;
    content: string;
  };
}

export default function TaxPrepChecklist() {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      id: 'election',
      title: '1 · Election documentation',
      color: '#3C3489',
      bgColor: '#EEEDFE',
      items: [
        {
          id: 'e1',
          label: 'IRC §475(f) election statement — copy filed with 2024 return',
          note: 'Confirm election timely made by due date of 2023 return (or extension); first effective year is 2024',
          checked: false
        },
        {
          id: 'e2',
          label: 'Proof of filing / transmission confirmation',
          note: 'E-file acknowledgment or certified mail receipt showing election attached to timely filed return',
          checked: false
        }
      ],
      noteBox: {
        type: 'danger',
        title: '⚠ Critical — election validity gates everything',
        content: 'If the §475(f) election is missing, untimely, or defective, the MTM method does not apply. Verify before building any workpaper. A defective election may require a private letter ruling or accounting method change (Form 3115) to cure.'
      }
    },
    {
      id: '481a',
      title: '2 · Section 481(a) adjustment — 12/31/2024 data',
      color: '#085041',
      bgColor: '#E1F5EE',
      items: [
        {
          id: 'a1',
          label: 'Complete brokerage statement as of 12/31/2024',
          note: 'All accounts; must show all open positions with FMV on that date',
          checked: false
        },
        {
          id: 'a2',
          label: 'Detailed open position report as of 12/31/2024',
          note: 'Position-level: security name, quantity, per-share basis, total adjusted basis, closing price, FMV',
          checked: false
        },
        {
          id: 'a3',
          label: 'Supplemental broker schedule — basis & FMV (12/31/2024)',
          note: 'Broker cost-basis report or supplemental showing tax lot detail; needed to reconcile 481(a) to return',
          checked: false
        }
      ],
      noteBox: {
        type: 'info',
        title: 'Formula: 481(a) Adjustment',
        content: '= FMV of open positions (12/31/2024) − Tax basis of open positions (12/31/2024)\nPositive result = ordinary income. Spread over 4 years unless taxpayer elects 1-year inclusion per Rev. Proc. 2015-13.'
      }
    },
    {
      id: 'mtm2025',
      title: '3 · 2025 MTM gain/loss — current-year data',
      color: '#633806',
      bgColor: '#FAEEDA',
      items: [
        {
          id: 'm1',
          label: 'Complete brokerage statement as of 12/31/2025',
          note: 'All accounts; year-end positions with closing FMV',
          checked: false
        },
        {
          id: 'm2',
          label: 'Detailed open position report as of 12/31/2025',
          note: 'Same format as 12/31/2024 report; needed for year-end MTM adjustment leg',
          checked: false
        },
        {
          id: 'm3',
          label: '2025 realized gain/loss report',
          note: 'All closed positions during 2025; shows proceeds, basis, holding period, and net gain/loss',
          checked: false
        },
        {
          id: 'm4',
          label: '2025 Form 1099-B',
          note: 'Required but not sufficient alone — open positions not reported; use to cross-check realized activity only',
          checked: false
        },
        {
          id: 'm5',
          label: 'Supplemental broker schedule — basis & FMV (12/31/2025)',
          note: 'Tax lot detail for open positions at year-end; confirms the MTM adjustment amount',
          checked: false
        }
      ],
      noteBox: {
        type: 'info',
        title: 'Formula: 2025 MTM ordinary gain/loss',
        content: '= Realized gain/loss (2025) + [FMV of open positions (12/31/2025) − Tax basis of open positions (12/31/2025)]\nResult is ordinary income/loss — reported on Form 4797, Part II.'
      }
    },
    {
      id: 'return',
      title: '4 · Return & workpaper tie-out',
      color: '#0C447C',
      bgColor: '#E6F1FB',
      items: [
        {
          id: 'r1',
          label: 'Prior-year return (2024 Form 1040 / Schedule D / Form 8949)',
          note: 'Needed to confirm no MTM income was already reported and to verify carry items',
          checked: false
        },
        {
          id: 'r2',
          label: 'Form 3115 (if applicable) — change in accounting method',
          note: 'Required if election was not attached timely and method change is needed to adopt MTM retroactively',
          checked: false
        }
      ]
    }
  ]);

  const keyIssues = [
    {
      type: 'warn' as const,
      title: '481(a) spread period',
      content: 'A positive 481(a) adjustment is spread ratably over 4 tax years (25%/yr) under Rev. Proc. 2015-13 unless the taxpayer elects 1-year inclusion. A negative adjustment is taken entirely in year 1. Confirm election intent before filing.'
    },
    {
      type: 'warn' as const,
      title: 'Ordinary income character — no capital gain treatment',
      content: 'All MTM gains and losses are ordinary under §475(f). No long-term capital gain rates apply. Confirm taxpayer understands the rate differential, especially if large unrealized gains existed at 12/31/2024.'
    },
    {
      type: 'warn' as const,
      title: 'Wash sale rules do not apply to §475 traders',
      content: '§475(f) dealers/traders are exempt from §1091 wash sale rules. Do not apply wash sale adjustments to MTM positions. Verify 1099-B wash sale adjustments are reversed in the workpaper if broker applied them.'
    },
    {
      type: 'warn' as const,
      title: 'QBI / SE income',
      content: 'Trader in securities income is generally not subject to SE tax and may not qualify for §199A QBI deduction. Confirm trader vs. investor status and whether this is a sole prop or entity structure.'
    },
    {
      type: 'danger' as const,
      title: '1099-B alone is insufficient for this engagement',
      content: 'The 1099-B only captures closed positions and does not reflect open position FMV or the 481(a) conversion adjustment. Do not finalize the return without the complete position reports from the brokerage.'
    }
  ];

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          }
        : section
    ));
  };

  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
  const checkedItems = sections.reduce((sum, section) =>
    sum + section.items.filter(item => item.checked).length, 0
  );
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const getNoteBoxColor = (type: 'info' | 'warn' | 'danger') => {
    switch (type) {
      case 'info':
        return { bg: '#E6F1FB', border: '#378ADD', text: '#042C53' };
      case 'warn':
        return { bg: '#FAEEDA', border: '#EF9F27', text: '#633806' };
      case 'danger':
        return { bg: '#FCEBEB', border: '#E24B4A', text: '#501313' };
    }
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: "28px 20px", fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.primary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
          IRC §475(f) MTM · Tax Preparation Checklist
        </div>
        <div style={{ fontSize: 28, color: colors.text, fontFamily: "'DM Serif Display', serif", lineHeight: 1.2, fontWeight: 700 }}>
          Day Trader MTM Tax Prep Checklist
        </div>
        <div style={{ fontSize: 13, color: colors.textLight, marginTop: 6 }}>
          First-year Mark-to-Market engagement · Section 481(a) adjustment required
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "#534AB7",
            borderRadius: 3,
            width: `${progress}%`,
            transition: "width 0.3s"
          }} />
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 5 }}>
          {checkedItems} of {totalItems} items collected
        </div>
      </div>

      {/* Checklist Sections */}
      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: 24 }}>
          <div style={{
            background: section.bgColor,
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <span style={{ fontSize: 14, color: section.color, fontWeight: 600, flex: 1 }}>
              {section.title}
            </span>
            <span style={{
              fontSize: 11,
              padding: "2px 10px",
              borderRadius: 20,
              background: section.color,
              color: "white",
              fontWeight: 600
            }}>
              {section.items.length} items
            </span>
          </div>

          <div style={{ paddingLeft: 4 }}>
            {section.items.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(section.id, item.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "background 0.12s",
                  marginBottom: 4
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  border: `2px solid ${item.checked ? '#534AB7' : colors.border}`,
                  borderRadius: 4,
                  flexShrink: 0,
                  marginTop: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: item.checked ? '#534AB7' : 'transparent',
                  transition: "all 0.15s"
                }}>
                  {item.checked && (
                    <div style={{
                      width: 5,
                      height: 9,
                      borderRight: "2px solid white",
                      borderBottom: "2px solid white",
                      transform: "rotate(45deg) translate(-1px, -1px)"
                    }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: colors.text, fontWeight: 500, lineHeight: 1.55 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2, lineHeight: 1.5 }}>
                    {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {section.noteBox && (
            <div style={{
              marginTop: 12,
              padding: "12px 16px",
              borderRadius: 8,
              borderLeft: `3px solid ${getNoteBoxColor(section.noteBox.type).border}`,
              background: getNoteBoxColor(section.noteBox.type).bg,
              color: getNoteBoxColor(section.noteBox.type).text
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                {section.noteBox.title}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-line", fontFamily: "'IBM Plex Mono', monospace" }}>
                {section.noteBox.content}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: colors.border, margin: "28px 0" }} />

      {/* Key Issues Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          background: "#FAECE7",
          padding: "10px 14px",
          borderRadius: 8,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <span style={{ fontSize: 14, color: "#4A1B0C", fontWeight: 600, flex: 1 }}>
            5 · Key issues to flag
          </span>
          <span style={{
            fontSize: 11,
            padding: "2px 10px",
            borderRadius: 20,
            background: "#F0997B",
            color: "#4A1B0C",
            fontWeight: 600
          }}>
            {keyIssues.length} notes
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 4 }}>
          {keyIssues.map((issue, index) => (
            <div
              key={index}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                borderLeft: `3px solid ${getNoteBoxColor(issue.type).border}`,
                background: getNoteBoxColor(issue.type).bg,
                color: getNoteBoxColor(issue.type).text
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                {issue.title}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace" }}>
                {issue.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
