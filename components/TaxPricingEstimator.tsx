'use client';

import { useState, ChangeEvent } from 'react';

// Color theme matching other tools
const colors = {
  primary: "#2563eb",
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
  bg: "#f8fafc",
  bgCard: "#ffffff",
  bgInput: "#f1f5f9",
  border: "#cbd5e1",
  borderFocus: "#94a3b8",
  text: "#0f172a",
  textLight: "#334155",
  textMuted: "#475569",
};

type TaxType = 'individual' | 'business' | null;
type EntityType = 'partnership' | 's_corp' | 'c_corp' | null;

interface PriceBreakdown {
  item: string;
  price: number;
}

export default function TaxPricingEstimator() {
  const [step, setStep] = useState(0);
  const [taxType, setTaxType] = useState<TaxType>(null);

  // Individual Tax state
  const [hasW2, setHasW2] = useState(false);
  const [hasScheduleC, setHasScheduleC] = useState(false);
  const [scheduleCRevenue, setScheduleCRevenue] = useState('');
  const [hasInventory, setHasInventory] = useState(false);
  const [hasInvestment, setHasInvestment] = useState(false);
  const [tradeCount, setTradeCount] = useState('');
  const [hasCrypto, setHasCrypto] = useState(false);
  const [isDayTrader, setIsDayTrader] = useState(false);
  const [isFirstYearMTM, setIsFirstYearMTM] = useState(false);
  const [rentalProperties, setRentalProperties] = useState('0');
  const [k1Count, setK1Count] = useState('0');
  const [hasStockOptions, setHasStockOptions] = useState(false);
  const [isFirstTimeFiler, setIsFirstTimeFiler] = useState(false);

  // Business Tax state
  const [entityType, setEntityType] = useState<EntityType>(null);
  const [businessRevenue, setBusinessRevenue] = useState('');
  const [partnerCount, setPartnerCount] = useState('0');
  const [hasBusinessInventory, setHasBusinessInventory] = useState(false);

  const calculatePrice = (): { total: number; breakdown: PriceBreakdown[] } => {
    const breakdown: PriceBreakdown[] = [];

    if (taxType === 'individual') {
      // Base price
      if (isDayTrader) {
        breakdown.push({
          item: isFirstYearMTM ? 'Day Trader MTM (First Year with 481(a))' : 'Day Trader MTM (Continuing)',
          price: isFirstYearMTM ? 2000 : 1500
        });

        const trades = parseInt(tradeCount) || 0;
        if (trades > 1000) {
          breakdown.push({ item: 'High-frequency trading (>1000 trades)', price: 400 });
        }
      } else if (hasScheduleC) {
        const revenue = parseInt(scheduleCRevenue) || 0;
        let schedCPrice = 800;
        if (revenue >= 150000) schedCPrice = 1500;
        else if (revenue >= 50000) schedCPrice = 1200;

        if (hasInventory) {
          breakdown.push({ item: 'Schedule C with inventory/COGS', price: schedCPrice + 200 });
        } else {
          breakdown.push({ item: 'Schedule C (self-employment income)', price: schedCPrice });
        }
      } else if (hasInvestment) {
        const trades = parseInt(tradeCount) || 0;
        let invPrice = 500;
        if (trades >= 500) invPrice = 1200;
        else if (trades >= 100) invPrice = 900;
        else if (trades > 0) invPrice = 650;

        breakdown.push({ item: 'Investment income & stock trading', price: invPrice });
      } else if (hasW2) {
        breakdown.push({ item: 'W-2 wage income (basic)', price: 360 });
      }

      // Add-ons
      if (hasCrypto && !isDayTrader) {
        breakdown.push({ item: 'Cryptocurrency trading', price: 700 });
      }

      const rentals = parseInt(rentalProperties) || 0;
      if (rentals > 0) {
        if (rentals === 1) breakdown.push({ item: 'Rental property (1)', price: 350 });
        else if (rentals <= 3) breakdown.push({ item: 'Rental properties (2-3)', price: 650 });
        else breakdown.push({ item: `Rental properties (${rentals})`, price: 1000 });
      }

      const k1s = parseInt(k1Count) || 0;
      if (k1s > 0) {
        breakdown.push({ item: k1s === 1 ? 'K-1 income (1)' : `K-1 income (${k1s})`, price: k1s === 1 ? 250 : 450 });
      }

      if (hasStockOptions) {
        breakdown.push({ item: 'Stock options (ISO/RSU/ESPP)', price: 350 });
      }

      if (isFirstTimeFiler) {
        breakdown.push({ item: 'First-time US tax filer', price: 150 });
      }

    } else if (taxType === 'business' && entityType) {
      const revenue = parseInt(businessRevenue) || 0;

      if (entityType === 'partnership') {
        let basePrice = 1500;
        if (revenue >= 300000) basePrice = 2800;
        else if (revenue >= 100000) basePrice = 2000;

        breakdown.push({ item: 'Partnership / LLC (Form 1065) - No employees', price: basePrice });

        const partners = parseInt(partnerCount) || 0;
        if (partners >= 4) {
          breakdown.push({ item: `${partners} partners`, price: 800 });
        } else if (partners >= 2) {
          breakdown.push({ item: `${partners} partners`, price: 400 });
        }
      } else if (entityType === 's_corp') {
        let basePrice = 1800;
        if (revenue >= 500000) basePrice = 4000;
        else if (revenue >= 200000) basePrice = 2800;

        breakdown.push({ item: 'S Corporation (Form 1120-S) - Owner only', price: basePrice });
      } else if (entityType === 'c_corp') {
        let basePrice = 2800;
        if (revenue >= 500000) basePrice = 4500;

        breakdown.push({ item: 'C Corporation (Form 1120) - No employees', price: basePrice });
      }

      if (hasBusinessInventory) {
        breakdown.push({ item: 'Inventory management (COGS)', price: 500 });
      }
    }

    const total = breakdown.reduce((sum, item) => sum + item.price, 0);
    return { total, breakdown };
  };

  const { total, breakdown } = calculatePrice();

  const canProceed = [
    taxType !== null,
    true,
    true
  ];

  const steps = [
    { title: "Service Type", subtitle: "Individual or Business tax return" },
    { title: "Details", subtitle: "Income sources and complexity" },
    { title: "Estimate", subtitle: "Price breakdown and next steps" }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
      `}</style>

      <div style={{ background: colors.bg, minHeight: "100vh", padding: "28px 20px", fontFamily: "'IBM Plex Mono', monospace" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: colors.primary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            Tax Filing Service · Price Estimator
          </div>
          <div style={{ fontSize: 28, color: colors.text, fontFamily: "'DM Serif Display', serif", lineHeight: 1.2, fontWeight: 700 }}>
            Tax Preparation Pricing
          </div>
          <div style={{ fontSize: 13, color: colors.textLight, marginTop: 6 }}>
            Get an estimated price for your tax filing needs
          </div>
          <div style={{ fontSize: 12, color: colors.warning, marginTop: 8, fontWeight: 600, padding: "8px 12px", background: "#fef3c7", borderRadius: 6, border: "1px solid #fbbf24" }}>
            ⚠️ This is an approximate estimate. Final price may be adjusted based on actual tax forms and complexity.
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => canProceed[i] && setStep(i)}
              disabled={!canProceed[i]}
              style={{
                background: step === i ? "#3b4d7d" : canProceed[i] && i < step ? "#4c6187" : "#6b7fa8",
                border: "none",
                borderRadius: 8,
                padding: "14px 18px",
                cursor: canProceed[i] ? "pointer" : "not-allowed",
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

          {/* Step 0: Tax Type Selection */}
          {step === 0 && (
            <div>
              <div style={{ fontSize: 20, color: colors.text, fontWeight: 700, marginBottom: 20, fontFamily: "'DM Serif Display', serif" }}>
                What type of tax return do you need?
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={() => setTaxType('individual')}
                  style={{
                    padding: "20px",
                    border: `2px solid ${taxType === 'individual' ? colors.primary : colors.border}`,
                    borderRadius: 8,
                    background: taxType === 'individual' ? "#dbeafe" : "white",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 6 }}>
                    Individual Tax Return (Form 1040)
                  </div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>
                    Personal income tax including W-2, Schedule C, investments, rentals, etc.
                  </div>
                </button>

                <button
                  onClick={() => setTaxType('business')}
                  style={{
                    padding: "20px",
                    border: `2px solid ${taxType === 'business' ? colors.primary : colors.border}`,
                    borderRadius: 8,
                    background: taxType === 'business' ? "#dbeafe" : "white",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 6 }}>
                    Business Tax Return
                  </div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>
                    Partnership (1065), S-Corp (1120-S), or C-Corp (1120) - No employees only
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Individual Details */}
          {step === 1 && taxType === 'individual' && (
            <div>
              <div style={{ fontSize: 20, color: colors.text, fontWeight: 700, marginBottom: 20, fontFamily: "'DM Serif Display', serif" }}>
                Tell us about your income sources
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
                  Primary Income (select one or more):
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={hasW2} onChange={(e) => setHasW2(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>W-2 wage income</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={hasScheduleC} onChange={(e) => setHasScheduleC(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>Self-employment income (Schedule C)</span>
                </label>

                {hasScheduleC && (
                  <div style={{ marginLeft: 30, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Annual self-employment revenue:</div>
                    <select value={scheduleCRevenue} onChange={(e) => setScheduleCRevenue(e.target.value)} style={{ padding: "8px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }}>
                      <option value="">Select range</option>
                      <option value="25000">Less than $50,000</option>
                      <option value="100000">$50,000 - $150,000</option>
                      <option value="200000">Over $150,000</option>
                    </select>

                    <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={hasInventory} onChange={(e) => setHasInventory(e.target.checked)} style={{ accentColor: colors.primary }} />
                      <span style={{ fontSize: 12, color: colors.textMuted }}>I have inventory/COGS</span>
                    </label>
                  </div>
                )}

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={hasInvestment} onChange={(e) => setHasInvestment(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>Investment income (stocks/funds)</span>
                </label>

                {hasInvestment && (
                  <div style={{ marginLeft: 30, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Approximate number of trades:</div>
                    <input
                      type="number"
                      value={tradeCount}
                      onChange={(e) => setTradeCount(e.target.value)}
                      placeholder="e.g., 50"
                      style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13, width: "150px" }}
                    />
                  </div>
                )}

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={hasCrypto} onChange={(e) => setHasCrypto(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>Cryptocurrency trading</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={isDayTrader} onChange={(e) => setIsDayTrader(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text, fontWeight: 600 }}>I am a Day Trader with MTM election</span>
                </label>

                {isDayTrader && (
                  <div style={{ marginLeft: 30, marginBottom: 10 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={isFirstYearMTM} onChange={(e) => setIsFirstYearMTM(e.target.checked)} style={{ accentColor: colors.primary }} />
                      <span style={{ fontSize: 12, color: colors.textMuted }}>First year MTM (includes 481(a) adjustment)</span>
                    </label>
                    <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 8, marginBottom: 4 }}>Number of trades:</div>
                    <input
                      type="number"
                      value={tradeCount}
                      onChange={(e) => setTradeCount(e.target.value)}
                      placeholder="e.g., 500"
                      style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13, width: "150px" }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
                  Additional Income:
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Rental properties:</div>
                  <input
                    type="number"
                    value={rentalProperties}
                    onChange={(e) => setRentalProperties(e.target.value)}
                    min="0"
                    style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13, width: "100px" }}
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>K-1 forms (Partnership/S-Corp income):</div>
                  <input
                    type="number"
                    value={k1Count}
                    onChange={(e) => setK1Count(e.target.value)}
                    min="0"
                    style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13, width: "100px" }}
                  />
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={hasStockOptions} onChange={(e) => setHasStockOptions(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>Stock options (ISO/RSU/ESPP)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={isFirstTimeFiler} onChange={(e) => setIsFirstTimeFiler(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>First-time US tax filer</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 1: Business Details */}
          {step === 1 && taxType === 'business' && (
            <div>
              <div style={{ fontSize: 20, color: colors.text, fontWeight: 700, marginBottom: 20, fontFamily: "'DM Serif Display', serif" }}>
                Tell us about your business
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
                  Business entity type:
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="entityType"
                      checked={entityType === 'partnership'}
                      onChange={() => setEntityType('partnership')}
                      style={{ accentColor: colors.primary }}
                    />
                    <span style={{ fontSize: 13, color: colors.text }}>Partnership / Multi-member LLC (Form 1065)</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="entityType"
                      checked={entityType === 's_corp'}
                      onChange={() => setEntityType('s_corp')}
                      style={{ accentColor: colors.primary }}
                    />
                    <span style={{ fontSize: 13, color: colors.text }}>S Corporation (Form 1120-S) - Owner only</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="entityType"
                      checked={entityType === 'c_corp'}
                      onChange={() => setEntityType('c_corp')}
                      style={{ accentColor: colors.primary }}
                    />
                    <span style={{ fontSize: 13, color: colors.text }}>C Corporation (Form 1120)</span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
                  Annual business revenue:
                </div>
                <select
                  value={businessRevenue}
                  onChange={(e) => setBusinessRevenue(e.target.value)}
                  style={{ padding: "10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13, width: "100%" }}
                >
                  <option value="">Select revenue range</option>
                  <option value="50000">Less than $100,000</option>
                  <option value="200000">$100,000 - $300,000</option>
                  <option value="400000">$300,000 - $500,000</option>
                  <option value="750000">$500,000 - $1,000,000</option>
                  <option value="1500000">Over $1,000,000</option>
                </select>
              </div>

              {entityType === 'partnership' && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Number of partners:</div>
                  <input
                    type="number"
                    value={partnerCount}
                    onChange={(e) => setPartnerCount(e.target.value)}
                    min="0"
                    style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13, width: "100px" }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={hasBusinessInventory} onChange={(e) => setHasBusinessInventory(e.target.checked)} style={{ accentColor: colors.primary }} />
                  <span style={{ fontSize: 13, color: colors.text }}>Business has inventory (COGS)</span>
                </label>
              </div>

              <div style={{ padding: "16px", background: "#fef3c7", borderRadius: 8, border: "1px solid #fbbf24" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#78350f", marginBottom: 6 }}>
                  ⚠️ Important:
                </div>
                <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.6 }}>
                  We only accept businesses WITHOUT employees. If you need payroll services, please contact us for a referral.
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Price Estimate */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 20, color: colors.text, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>
                Estimated Service Price
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 24 }}>
                {taxType === 'individual' ? 'Individual Tax Return (Form 1040)' : 'Business Tax Return'}
              </div>

              {breakdown.length > 0 ? (
                <>
                  <div style={{ marginBottom: 24 }}>
                    {breakdown.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${colors.border}` }}>
                        <span style={{ fontSize: 13, color: colors.textLight }}>{item.item}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: colors.text, fontFamily: "'IBM Plex Mono', monospace" }}>
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: "20px", background: "#dbeafe", borderRadius: 8, marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>Estimated Total</span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: colors.primary, fontFamily: "'IBM Plex Mono', monospace" }}>
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "16px", background: "#fef3c7", borderRadius: 8, border: "1px solid #fbbf24", marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#78350f", marginBottom: 6 }}>
                      ⚠️ Important Disclaimer:
                    </div>
                    <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.6 }}>
                      This is an approximate estimate based on the information provided. The final price may be adjusted after reviewing your actual tax documents and complexity. We will confirm the exact price during your free consultation.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => window.location.href = '/contact'}
                      style={{
                        flex: 1,
                        padding: "14px 24px",
                        background: colors.primary,
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'IBM Plex Mono', monospace"
                      }}
                    >
                      Schedule Free Consultation →
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ padding: "24px", background: "#fef2f2", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: "#991b1b", fontWeight: 600 }}>
                    Please select at least one income source to get an estimate.
                  </div>
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

          {step < 2 && (
            <button
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              disabled={!canProceed[step + 1]}
              style={{
                background: canProceed[step + 1] ? colors.primary : colors.bgInput,
                border: `2px solid ${canProceed[step + 1] ? colors.primary : colors.border}`,
                borderRadius: 8,
                color: canProceed[step + 1] ? "white" : colors.textMuted,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                padding: "10px 20px",
                cursor: canProceed[step + 1] ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </>
  );
}
