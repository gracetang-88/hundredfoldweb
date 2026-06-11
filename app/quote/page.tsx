'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

type QuoteTab = 'travel' | 'commercial';

/* Simple actuarial-style estimate for visitor/travel medical insurance.
   Rates are rough daily premiums by age band and coverage level, for an
   instant ballpark only — final pricing always comes from the carrier. */
function estimateTravelPremium(age: number, days: number, coverage: 'basic' | 'standard' | 'premium') {
  const base: Record<string, [number, number, number, number, number]> = {
    // age bands:  0-39  40-59  60-69  70-79  80+
    basic: [1.2, 1.8, 3.2, 5.5, 8.5],
    standard: [1.9, 2.8, 5.0, 8.6, 13.0],
    premium: [2.8, 4.2, 7.5, 12.8, 19.5],
  };
  const band = age < 40 ? 0 : age < 60 ? 1 : age < 70 ? 2 : age < 80 ? 3 : 4;
  const daily = base[coverage][band];
  const low = Math.round(daily * days * 0.85);
  const high = Math.round(daily * days * 1.25);
  return { low, high };
}

export default function QuotePage() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [tab, setTab] = useState<QuoteTab>('travel');

  // Travel quote state
  const [age, setAge] = useState('');
  const [days, setDays] = useState('');
  const [coverage, setCoverage] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [travelResult, setTravelResult] = useState<{ low: number; high: number } | null>(null);

  // Commercial quote state
  const [bizSubmitted, setBizSubmitted] = useState(false);
  const [biz, setBiz] = useState({
    name: '', businessType: '', employees: '', revenue: '',
    coverageTypes: [] as string[], contact: '', email: '',
  });

  const handleTravelQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseInt(age, 10);
    const d = parseInt(days, 10);
    if (!a || !d || a < 0 || a > 110 || d < 1 || d > 365) return;
    setTravelResult(estimateTravelPremium(a, d, coverage));
  };

  const toggleCoverageType = (type: string) => {
    setBiz((prev) => ({
      ...prev,
      coverageTypes: prev.coverageTypes.includes(type)
        ? prev.coverageTypes.filter((t) => t !== type)
        : [...prev.coverageTypes, type],
    }));
  };

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to an API / CRM / email service.
    setBizSubmitted(true);
  };

  const bizCoverageOptions = en
    ? ['General Liability', 'Commercial Property', "Workers' Compensation", 'Business Owner\'s Policy (BOP)', 'Commercial Auto', 'Other']
    : ['企业责任险', '商业财产险', '劳工保险', '企业主综合保单 (BOP)', '商业车险', '其他'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-gradient-to-br from-gray-50 via-blue-50/40 to-green-50/60 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-green-200/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            {en ? 'Get a Quote Online' : '在线获取报价'}
          </h1>
          <p className="text-center text-gray-600 mb-10 text-lg">
            {en
              ? 'Instant estimates for travel insurance, and fast quote requests for your business.'
              : '旅游保险即时估算，商业保险快速报价请求。'}
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => setTab('travel')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                tab === 'travel'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              ✈️ {en ? 'Travel Insurance' : '旅游保险'}
            </button>
            <button
              onClick={() => setTab('commercial')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                tab === 'commercial'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              🏢 {en ? 'Commercial Insurance' : '商业保险'}
            </button>
          </div>

          {/* Travel Quote */}
          {tab === 'travel' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {en ? 'Instant Travel / Visitor Insurance Estimate' : '旅游 / 探亲保险即时估算'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {en
                  ? 'Get a ballpark estimate in seconds. Final pricing is confirmed by the carrier at enrollment.'
                  : '几秒钟获得估算价格区间。最终价格以保险公司投保时确认为准。'}
              </p>
              <form onSubmit={handleTravelQuote} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {en ? "Traveler's Age" : '旅客年龄'}
                    </label>
                    <input
                      type="number" min="0" max="110" required value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder={en ? 'e.g. 65' : '例如 65'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {en ? 'Trip Length (days)' : '行程天数'}
                    </label>
                    <input
                      type="number" min="1" max="365" required value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder={en ? 'e.g. 90' : '例如 90'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {en ? 'Coverage Level' : '保障等级'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['basic', 'standard', 'premium'] as const).map((level) => (
                      <button
                        key={level} type="button"
                        onClick={() => setCoverage(level)}
                        className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          coverage === level
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                        }`}
                      >
                        {en
                          ? level.charAt(0).toUpperCase() + level.slice(1)
                          : level === 'basic' ? '基础' : level === 'standard' ? '标准' : '高级'}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {en ? 'Calculate Estimate' : '计算估算价格'}
                </button>
              </form>

              {travelResult && (
                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <p className="text-gray-600 text-sm mb-1">
                    {en ? 'Estimated Premium Range' : '估算保费区间'}
                  </p>
                  <p className="text-3xl font-bold text-emerald-700">
                    ${travelResult.low} – ${travelResult.high}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {en
                      ? 'Estimate only. Contact us to compare exact plans and enroll.'
                      : '仅为估算。请联系我们比较具体计划并投保。'}
                  </p>
                  <a
                    href="/contact"
                    className="inline-block mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    {en ? 'Get Exact Plans →' : '获取具体方案 →'}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Commercial Quote */}
          {tab === 'commercial' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {bizSubmitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {en ? 'Quote Request Received!' : '报价请求已收到！'}
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {en
                      ? 'We will shop the market across our carriers and get back to you — usually within one business day.'
                      : '我们将在合作的保险公司中为您比价，通常在一个工作日内回复您。'}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {en ? 'Commercial Insurance Quote Request' : '商业保险报价请求'}
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {en
                      ? 'Tell us about your business and we will compare dozens of carriers for your best rate — usually within one business day.'
                      : '告诉我们您的业务情况，我们为您在数十家保险公司中比价 — 通常一个工作日内回复。'}
                  </p>
                  <form onSubmit={handleBizSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {en ? 'Business Name' : '企业名称'}
                        </label>
                        <input
                          type="text" required value={biz.name}
                          onChange={(e) => setBiz({ ...biz, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {en ? 'Business Type' : '行业类型'}
                        </label>
                        <input
                          type="text" required value={biz.businessType}
                          onChange={(e) => setBiz({ ...biz, businessType: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder={en ? 'e.g. Restaurant, Retail, Office' : '例如：餐馆、零售、办公室'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {en ? 'Number of Employees' : '员工人数'}
                        </label>
                        <input
                          type="number" min="0" value={biz.employees}
                          onChange={(e) => setBiz({ ...biz, employees: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {en ? 'Annual Revenue (approx.)' : '年营业额（大约）'}
                        </label>
                        <input
                          type="text" value={biz.revenue}
                          onChange={(e) => setBiz({ ...biz, revenue: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          placeholder={en ? 'e.g. $500,000' : '例如 $500,000'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {en ? 'Coverage Needed (select all that apply)' : '所需保险（可多选）'}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {bizCoverageOptions.map((type) => (
                          <label
                            key={type}
                            className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                              biz.coverageTypes.includes(type)
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={biz.coverageTypes.includes(type)}
                              onChange={() => toggleCoverageType(type)}
                              className="accent-emerald-600"
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {en ? 'Contact Name & Phone' : '联系人和电话'}
                        </label>
                        <input
                          type="text" required value={biz.contact}
                          onChange={(e) => setBiz({ ...biz, contact: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {en ? 'Email' : '电子邮箱'}
                        </label>
                        <input
                          type="email" required value={biz.email}
                          onChange={(e) => setBiz({ ...biz, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      {en ? 'Request My Quote' : '提交报价请求'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
