import { NextRequest, NextResponse } from 'next/server';

/* AI assistant for HundredFold.
   - With ANTHROPIC_API_KEY set: uses Claude for natural conversation.
   - Without a key: falls back to keyword-based guidance so the widget
     still routes visitors to the right page. */

const SYSTEM_PROMPT = `You are the friendly AI assistant for HundredFold (百福), an independent insurance agency and tax practice in the Bay Area, serving clients in English and Chinese. Always reply in the same language the user writes in.

ABOUT THE BUSINESS:
- Independent agency representing DOZENS of top-rated insurance carriers (we shop the market for clients).
- Services: Life Insurance (term, whole life, IUL, final expense), Annuities (fixed, fixed indexed, lifetime income, 401k/IRA rollovers), Commercial Insurance (general liability, commercial property, workers' comp, BOP, commercial auto), Travel Insurance (visitors-to-USA medical, travel medical, trip protection), Tax Services (individual & business returns, IRS dispute representation, tax planning).
- Real estate and lending services are COMING SOON — not yet available.
- Bilingual: English and Chinese.

WEBSITE PAGES (always give the path when directing users):
- /services — all services overview
- /services/life-insurance — life insurance details
- /services/annuity — annuity details
- /services/commercial-insurance — commercial insurance details
- /services/travel-insurance — travel insurance details
- /services/tax-services — tax services details
- /quote — instant online travel insurance estimates AND commercial insurance quote requests
- /contact — contact form and office info

YOUR JOB:
1. Understand the visitor's need and direct them to the right page.
2. For travel insurance or commercial insurance pricing questions → send them to /quote.
3. For tax appointments, tell them which documents to prepare:
   - Individual returns: photo ID, SSN/ITIN for everyone on the return, all W-2s and 1099s, last year's return, mortgage interest (1098), property tax, childcare expenses, education (1098-T).
   - Business returns: profit & loss statement, balance sheet, payroll reports, 1099s issued/received, prior year return, EIN letter, major asset purchases.
   - IRS disputes: bring the IRS/state notice letter, the tax return in question, and any prior correspondence.
4. Never quote exact prices or guarantee coverage — estimates come from the /quote page and final pricing from carriers. Never give specific tax or legal advice; recommend a consultation instead.
5. Keep replies concise (2-4 sentences when possible), warm, and professional. End with a helpful next step.
6. For complex situations, recommend contacting the team via /contact.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* ---------- Rule-based fallback (no API key required) ---------- */

interface Rule {
  keywords: string[];
  en: string;
  zh: string;
}

const RULES: Rule[] = [
  {
    keywords: ['life insurance', 'term life', 'whole life', 'iul', '人寿', '寿险', '终身', '定期'],
    en: "We offer term life, whole life, IUL, and final expense coverage from dozens of carriers. You can learn more at /services/life-insurance, or reach us at /contact for a free policy review. Would you like to tell me a bit about who you'd like to protect?",
    zh: '我们提供定期寿险、终身寿险、IUL 和丧葬费用保险，代理数十家保险公司的产品。详情请看 /services/life-insurance，或通过 /contact 预约免费保单检视。方便告诉我您想为谁投保吗？',
  },
  {
    keywords: ['annuity', 'retirement', '401k', '401(k)', 'ira', 'rollover', '年金', '退休', '转存'],
    en: 'Annuities can turn your savings into guaranteed lifetime income, and we can help roll over a 401(k)/IRA without triggering taxes. See /services/annuity for details, or book a consultation at /contact.',
    zh: '年金可以把您的积蓄变成终身保证收入，我们也可以协助您在不触发税务的情况下转存 401(k)/IRA。详情请看 /services/annuity，或在 /contact 预约咨询。',
  },
  {
    keywords: ['business insurance', 'commercial', 'liability', 'workers comp', 'workers\' comp', 'restaurant', 'llc', '商业保险', '责任险', '劳工', '餐馆', '企业'],
    en: "We insure restaurants, retail, offices, contractors and more — general liability, property, workers' comp, and BOP. You can request a quote online at /quote and we'll shop dozens of carriers, usually replying within one business day.",
    zh: '我们承保餐馆、零售、办公室、承包商等 — 企业责任险、财产险、劳工保险和 BOP。您可以在 /quote 在线提交报价请求，我们为您在数十家保险公司中比价，通常一个工作日内回复。',
  },
  {
    keywords: ['travel', 'visitor', 'visiting', 'trip', '旅游', '探亲', '访客', '旅行'],
    en: 'For travel and visitors-to-USA insurance, you can get an instant estimate right now at /quote — just enter the age, trip length, and coverage level. Details are at /services/travel-insurance.',
    zh: '旅游保险和美国探亲访客保险可以立即在 /quote 获取即时估算 — 只需输入年龄、行程天数和保障等级。详情请看 /services/travel-insurance。',
  },
  {
    keywords: ['tax', 'irs', 'audit', 'file', 'return', 'w-2', 'w2', '1099', '报税', '税务', '审计', '欠税'],
    en: 'We handle individual & business tax returns, IRS dispute representation, and tax planning — see /services/tax-services. For a tax appointment, please prepare: photo ID, SSNs, all W-2s/1099s, and last year\'s return (business clients: P&L, balance sheet, payroll reports). Book at /contact.',
    zh: '我们提供个人和企业报税、IRS 争议代理和税务规划 — 详见 /services/tax-services。报税预约请准备：带照片的证件、SSN、所有 W-2/1099 表格、去年的税表（企业客户另需损益表、资产负债表、工资报告）。请在 /contact 预约。',
  },
  {
    keywords: ['quote', 'price', 'cost', 'how much', '报价', '价格', '多少钱', '费用'],
    en: 'You can get pricing at /quote — instant estimates for travel insurance, and fast quote requests for commercial insurance (we reply within about one business day). Which type are you interested in?',
    zh: '您可以在 /quote 获取价格 — 旅游保险即时估算，商业保险快速报价请求（约一个工作日内回复）。请问您想了解哪一类？',
  },
  {
    keywords: ['real estate', 'mortgage', 'loan', 'lending', 'house', '房地产', '贷款', '买房'],
    en: 'Real estate and lending services are coming soon! In the meantime, we can help with insurance and tax. Leave your contact info at /contact and we will reach out when these services launch.',
    zh: '房地产和贷款服务即将推出！目前我们可以为您提供保险和税务服务。欢迎在 /contact 留下联系方式，服务上线时我们会第一时间通知您。',
  },
  {
    keywords: ['contact', 'phone', 'appointment', 'speak', 'human', 'agent', '联系', '电话', '预约', '人工'],
    en: 'You can reach our team through the contact form at /contact — we respond quickly and serve you in English or Chinese.',
    zh: '您可以通过 /contact 的联系表单找到我们 — 我们会尽快回复，提供中英文双语服务。',
  },
];

function hasChinese(text: string) {
  return /[一-鿿]/.test(text);
}

function ruleBasedReply(message: string): string {
  const lower = message.toLowerCase();
  const zh = hasChinese(message);
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return zh ? rule.zh : rule.en;
    }
  }
  return zh
    ? '您好！我是百福的智能助手。我可以帮您了解：人寿保险、年金、商业保险、旅游保险（支持在线报价 /quote）以及税务服务。请问您想了解哪方面？'
    : "Hi! I'm HundredFold's assistant. I can help with life insurance, annuities, commercial insurance, travel insurance (instant quotes at /quote), and tax services. What can I help you with today?";
}

/* ---------- Claude API path ---------- */

async function claudeReply(messages: ChatMessage[]): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: messages.slice(-12),
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
  return textBlock?.text ?? '';
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) {
      return NextResponse.json({ error: 'no user message' }, { status: 400 });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const reply = await claudeReply(messages);
        if (reply) return NextResponse.json({ reply, source: 'ai' });
      } catch (err) {
        console.error('Claude API failed, falling back to rules:', err);
      }
    }

    return NextResponse.json({ reply: ruleBasedReply(lastUser.content), source: 'rules' });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
