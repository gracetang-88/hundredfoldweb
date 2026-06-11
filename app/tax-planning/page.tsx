'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TaxCalculator from '@/components/TaxCalculator';
import { useLanguage } from '@/lib/LanguageContext';

export default function TaxPlanningPage() {
  const { language } = useLanguage();
  const [showCalculator, setShowCalculator] = useState(false);

  const content = {
    en: {
      title: 'Strategic Tax Planning',
      subtitle: 'Proactive strategies to minimize your tax liability and maximize wealth',
      cta: 'Launch Tax Calculator',
      ctaNote: 'Annual planning clients only',

      intro: {
        title: 'Why Tax Planning Matters',
        description: 'Tax planning is not just about filing returns—it\'s about making strategic decisions throughout the year that legally minimize your tax burden and optimize your financial position. Our clients save an average of $15,000-$50,000+ annually through proactive planning.',
      },

      scenarios: [
        {
          icon: '🏠',
          title: 'Property Sale Planning',
          profile: 'Real Estate Investor',
          description: 'Planning to sell a rental property that has appreciated significantly',
          challenge: 'Facing a large capital gain with potential tax liability exceeding $200,000',
          solution: 'Strategic tax planning options',
          strategies: [
            {
              name: '1031 Exchange',
              detail: 'Defer all capital gains by reinvesting in like-kind property',
              benefit: 'Zero immediate tax, preserved capital for reinvestment'
            },
            {
              name: 'Cost Segregation Study',
              detail: 'Accelerate depreciation on replacement property to offset other income',
              benefit: 'Additional $40,000-$80,000 in year-one deductions'
            },
            {
              name: 'Installment Sale',
              detail: 'Spread gain recognition over multiple years to avoid bracket creep',
              benefit: 'Lower effective tax rate, smoother cash flow'
            }
          ],
          example: {
            scenario: 'Sale of rental property with $800,000 gain',
            withoutPlanning: 'Tax liability: ~$238,000 (Fed + CA + NIIT)',
            withPlanning: 'Tax deferred via 1031 + cost seg creates $60,000 deduction',
            savings: 'Immediate savings: $238,000 tax deferred + $22,000 offset'
          }
        },
        {
          icon: '📈',
          title: 'RSU / ESPP Vesting Strategy',
          profile: 'Tech Professional',
          description: 'Receiving $150,000 in RSU vesting and participating in ESPP',
          challenge: 'Ordinary income spike pushing into higher tax brackets, withholding gap of $35,000',
          solution: 'Strategic equity comp planning',
          strategies: [
            {
              name: 'Withholding Adjustment',
              detail: 'Calculate exact quarterly estimated payments to avoid underpayment penalties',
              benefit: 'No surprises at tax time, optimized cash flow'
            },
            {
              name: 'Roth Mega Backdoor',
              detail: 'Utilize after-tax 401(k) contributions up to $70,000 annual limit',
              benefit: 'Convert high earners to tax-free growth, ~$180,000 over 20 years'
            },
            {
              name: 'ESPP Tax Optimization',
              detail: 'Plan qualifying vs. disqualifying dispositions based on bracket position',
              benefit: 'Save 10-15% on gain by meeting holding period requirements'
            }
          ],
          example: {
            scenario: '$150,000 RSU vest + $25,000 ESPP purchase',
            withoutPlanning: 'Withholding gap: $35,000, inefficient ESPP sale: $3,000 extra tax',
            withPlanning: 'Mega backdoor: $46,000 contributed, ESPP qualifying disposition',
            savings: 'Avoid penalty + $3,000 ESPP savings + $180,000 long-term Roth benefit'
          }
        },
        {
          icon: '🔄',
          title: 'Roth Conversion Ladder',
          profile: 'Pre-Retiree with Traditional IRA',
          description: 'Age 58 with $1.6M in traditional IRA, planning retirement at 62',
          challenge: 'Facing RMDs at 73 that will push into 35%+ brackets, pro-rata rule limiting backdoor Roth',
          solution: 'Multi-year Roth conversion strategy',
          strategies: [
            {
              name: 'Bracket-Aware Conversions',
              detail: 'Convert $120,000/year to stay within 24% bracket, avoid IRMAA bumps',
              benefit: 'Pay 24% now instead of 35%+ later on RMDs'
            },
            {
              name: 'Year-by-Year Optimization',
              detail: 'Front-load conversions during low-income years (age 58-62)',
              benefit: '5 years of conversions = $600,000 moved to tax-free Roth'
            },
            {
              name: 'Pro-Rata Elimination',
              detail: 'Roll traditional IRA into 401(k) before backdoor Roth contributions',
              benefit: 'Clean slate for annual $14,000 backdoor Roth contributions (couple)'
            }
          ],
          example: {
            scenario: '$1.6M traditional IRA, current age 58',
            withoutPlanning: 'RMD at 73 = $61,000/year taxed at 35%, total tax: $640,000 over lifetime',
            withPlanning: '5-year conversion of $600,000 at 24%, rest grows tax-free',
            savings: 'Tax savings: $66,000 + eliminate pro-rata rule for backdoor Roth'
          }
        },
        {
          icon: '📅',
          title: 'Estimated Tax Management',
          profile: 'Self-Employed / Business Owner',
          description: 'S-Corp with $450,000 net income, rental property, and stock trading',
          challenge: 'Complex income streams, previous underpayment penalty of $2,800',
          solution: 'Quarterly tax projection and safe harbor planning',
          strategies: [
            {
              name: 'Safe Harbor Calculation',
              detail: '110% of prior year tax (AGI > $150k) or 90% of current year',
              benefit: 'Avoid underpayment penalties completely'
            },
            {
              name: 'Income Smoothing',
              detail: 'Time S-Corp distributions and rental expenses to manage bracket',
              benefit: 'Reduce effective tax rate by 2-4%'
            },
            {
              name: 'Estimated Tax Calendar',
              detail: 'Quarterly projections with mid-year true-up based on actual income',
              benefit: 'Optimize cash flow, avoid over/under payment'
            }
          ],
          example: {
            scenario: '$450,000 S-Corp + $80,000 rental + $50,000 cap gains',
            withoutPlanning: 'Underpayment penalty: $2,800, poor cash flow management',
            withPlanning: 'Precise quarterly estimates: Q1 30%, Q2 40%, Q3 0%, Q4 30% (CA)',
            savings: 'Eliminate $2,800 penalty + optimize $140,000 cash flow timing'
          }
        }
      ],

      services: {
        title: 'Our Tax Planning Services',
        items: [
          {
            name: 'Annual Tax Planning Package',
            price: '$2,500 - $5,000',
            features: [
              'Comprehensive current-year tax projection',
              'Multi-year strategic tax planning (3-5 years)',
              'Quarterly estimated tax calculations with payment schedule',
              'Major transaction planning (property sales, RSU exercises, business changes)',
              'Roth conversion analysis and multi-year roadmap',
              'Access to premium tax calculators and planning tools',
              'Unlimited email support during tax year',
              'Two planning meetings (mid-year and year-end)'
            ]
          },
          {
            name: 'Transaction-Specific Planning',
            price: '$800 - $2,000',
            features: [
              'Property sale or 1031 exchange planning',
              'Business sale or acquisition tax structure',
              'RSU/ESPP concentrated position planning',
              'Cryptocurrency tax-loss harvesting strategy',
              'Cost segregation study coordination',
              'One-time strategic tax consultation'
            ]
          }
        ]
      },

      calculator: {
        title: 'Advanced Tax Planning Calculator',
        description: 'Our proprietary calculator helps you model complex tax scenarios including property sales, RSU/ESPP vesting, estimated tax requirements, Roth conversions, and more.',
        features: [
          'Real estate sale analysis (straight sale, 1031 exchange, cost segregation)',
          'RSU and ESPP tax impact with withholding gap analysis',
          'Quarterly estimated tax calculator with safe harbor rules',
          'Mega backdoor Roth capacity and conversion tax analysis',
          'Roth IRA conversion with pro-rata rule calculation',
          'Multi-year growth projections and tax savings visualization'
        ],
        accessNote: 'This calculator is exclusively available to Annual Tax Planning clients.'
      }
    },
    zh: {
      title: '战略税务规划',
      subtitle: '主动策略，最小化税负并最大化财富',
      cta: '启动税务计算器',
      ctaNote: '仅限年度规划客户',

      intro: {
        title: '为什么税务规划很重要',
        description: '税务规划不仅仅是申报税表——而是在全年做出战略决策，合法地最小化税负并优化您的财务状况。我们的客户通过主动规划平均每年节省 $15,000-$50,000+。',
      },

      scenarios: [
        {
          icon: '🏠',
          title: '房产出售规划',
          profile: '房地产投资者',
          description: '计划出售大幅增值的出租房产',
          challenge: '面临大额资本利得，潜在税负超过 $200,000',
          solution: '战略税务规划选项',
          strategies: [
            {
              name: '1031 同类交换',
              detail: '通过再投资同类房产延迟所有资本利得',
              benefit: '零即时税负，保留资本用于再投资'
            },
            {
              name: '成本分离研究',
              detail: '加速替代房产折旧以抵消其他收入',
              benefit: '第一年额外获得 $40,000-$80,000 扣除'
            },
            {
              name: '分期付款出售',
              detail: '将利得确认分散到多年以避免税率攀升',
              benefit: '降低有效税率，平滑现金流'
            }
          ],
          example: {
            scenario: '出售出租房产，利得 $800,000',
            withoutPlanning: '税负：~$238,000 (联邦 + 加州 + NIIT)',
            withPlanning: '通过 1031 延迟税负 + 成本分离创造 $60,000 扣除',
            savings: '即时节省：$238,000 税负延迟 + $22,000 抵消'
          }
        },
        {
          icon: '📈',
          title: 'RSU / ESPP 归属策略',
          profile: '科技专业人士',
          description: '获得 $150,000 RSU 归属并参与 ESPP',
          challenge: '普通收入激增推入更高税级，预扣缺口 $35,000',
          solution: '战略股权薪酬规划',
          strategies: [
            {
              name: '预扣调整',
              detail: '精确计算季度预估税款以避免少缴罚款',
              benefit: '报税时无意外，优化现金流'
            },
            {
              name: 'Roth Mega Backdoor',
              detail: '利用税后 401(k) 供款，年度限额最高 $70,000',
              benefit: '将高收入转为免税增长，20 年约 $180,000'
            },
            {
              name: 'ESPP 税务优化',
              detail: '根据税级位置规划合格 vs. 非合格处置',
              benefit: '通过满足持有期要求节省利得的 10-15%'
            }
          ],
          example: {
            scenario: '$150,000 RSU 归属 + $25,000 ESPP 购买',
            withoutPlanning: '预扣缺口：$35,000，低效 ESPP 出售：额外税款 $3,000',
            withPlanning: 'Mega backdoor：供款 $46,000，ESPP 合格处置',
            savings: '避免罚款 + $3,000 ESPP 节省 + $180,000 长期 Roth 收益'
          }
        },
        {
          icon: '🔄',
          title: 'Roth 转换阶梯',
          profile: '退休前期，持有传统 IRA',
          description: '58 岁，传统 IRA $1.6M，计划 62 岁退休',
          challenge: '73 岁面临 RMD 将推入 35%+ 税级，按比例规则限制后门 Roth',
          solution: '多年 Roth 转换策略',
          strategies: [
            {
              name: '税级感知转换',
              detail: '每年转换 $120,000 以保持在 24% 税级，避免 IRMAA 跳升',
              benefit: '现在支付 24% 而不是稍后 RMD 的 35%+'
            },
            {
              name: '逐年优化',
              detail: '在低收入年份（58-62 岁）前置转换',
              benefit: '5 年转换 = $600,000 转入免税 Roth'
            },
            {
              name: '消除按比例规则',
              detail: '在后门 Roth 供款前将传统 IRA 滚入 401(k)',
              benefit: '为年度 $14,000 后门 Roth 供款（夫妇）创造清白记录'
            }
          ],
          example: {
            scenario: '$1.6M 传统 IRA，当前 58 岁',
            withoutPlanning: '73 岁 RMD = $61,000/年按 35% 征税，终生总税款：$640,000',
            withPlanning: '5 年以 24% 转换 $600,000，其余免税增长',
            savings: '节税：$66,000 + 消除后门 Roth 按比例规则'
          }
        },
        {
          icon: '📅',
          title: '预估税管理',
          profile: '自雇 / 企业主',
          description: 'S-Corp 净收入 $450,000，出租房产和股票交易',
          challenge: '复杂收入来源，之前少缴罚款 $2,800',
          solution: '季度税务预测和安全港规划',
          strategies: [
            {
              name: '安全港计算',
              detail: '前一年税款的 110%（AGI > $150k）或当年的 90%',
              benefit: '完全避免少缴罚款'
            },
            {
              name: '收入平滑',
              detail: '时机安排 S-Corp 分配和租金支出以管理税级',
              benefit: '降低有效税率 2-4%'
            },
            {
              name: '预估税日历',
              detail: '季度预测，基于实际收入的年中调整',
              benefit: '优化现金流，避免多缴/少缴'
            }
          ],
          example: {
            scenario: '$450,000 S-Corp + $80,000 租金 + $50,000 资本利得',
            withoutPlanning: '少缴罚款：$2,800，现金流管理不佳',
            withPlanning: '精确季度预估：Q1 30%，Q2 40%，Q3 0%，Q4 30%（加州）',
            savings: '消除 $2,800 罚款 + 优化 $140,000 现金流时机'
          }
        }
      ],

      services: {
        title: '我们的税务规划服务',
        items: [
          {
            name: '年度税务规划套餐',
            price: '$2,500 - $5,000',
            features: [
              '综合当年税务预测',
              '多年战略税务规划（3-5 年）',
              '季度预估税计算和付款时间表',
              '重大交易规划（房产出售、RSU 行权、业务变更）',
              'Roth 转换分析和多年路线图',
              '访问高级税务计算器和规划工具',
              '税务年度内无限电子邮件支持',
              '两次规划会议（年中和年末）'
            ]
          },
          {
            name: '交易特定规划',
            price: '$800 - $2,000',
            features: [
              '房产出售或 1031 交换规划',
              '企业出售或收购税务结构',
              'RSU/ESPP 集中头寸规划',
              '加密货币税损收割策略',
              '成本分离研究协调',
              '一次性战略税务咨询'
            ]
          }
        ]
      },

      calculator: {
        title: '高级税务规划计算器',
        description: '我们的专有计算器帮助您模拟复杂的税务场景，包括房产出售、RSU/ESPP 归属、预估税要求、Roth 转换等。',
        features: [
          '房地产出售分析（直接出售、1031 交换、成本分离）',
          'RSU 和 ESPP 税务影响与预扣缺口分析',
          '季度预估税计算器，含安全港规则',
          'Mega backdoor Roth 容量和转换税分析',
          'Roth IRA 转换与按比例规则计算',
          '多年增长预测和节税可视化'
        ],
        accessNote: '此计算器仅供年度税务规划客户使用。'
      }
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {!showCalculator ? (
        <main className="flex-1 py-16 bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-black mb-4">
                {t.title}
              </h1>
              <p className="text-xl text-black max-w-3xl mx-auto mb-8">
                {t.subtitle}
              </p>
              <button
                onClick={() => setShowCalculator(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                {t.cta}
              </button>
              <p className="text-sm text-black mt-2">{t.ctaNote}</p>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">
                {t.intro.title}
              </h2>
              <p className="text-lg text-black leading-relaxed">
                {t.intro.description}
              </p>
            </div>

            {/* Client Scenarios */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-black mb-10 text-center">
                {language === 'en' ? 'Client Success Stories' : '客户成功案例'}
              </h2>

              <div className="space-y-12">
                {t.scenarios.map((scenario, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-4xl">{scenario.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold">{scenario.title}</h3>
                          <p className="text-blue-100">{scenario.profile}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="text-lg font-bold text-black mb-2">
                            {language === 'en' ? 'Situation' : '情况'}
                          </h4>
                          <p className="text-black">{scenario.description}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-red-600 mb-2">
                            {language === 'en' ? 'Challenge' : '挑战'}
                          </h4>
                          <p className="text-black">{scenario.challenge}</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-blue-700 mb-4">{scenario.solution}</h4>
                        <div className="space-y-4">
                          {scenario.strategies.map((strategy, idx) => (
                            <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                              <h5 className="font-bold text-black mb-1">{strategy.name}</h5>
                              <p className="text-sm text-black mb-1">{strategy.detail}</p>
                              <p className="text-sm text-green-600 font-semibold">
                                ✓ {strategy.benefit}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <h4 className="text-lg font-bold text-green-800 mb-4">
                          {language === 'en' ? 'Real Numbers' : '实际数据'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-black"><span className="font-semibold text-black">{language === 'en' ? 'Scenario:' : '场景：'}</span> {scenario.example.scenario}</p>
                          <p className="text-black"><span className="font-semibold text-red-700">{language === 'en' ? 'Without Planning:' : '无规划：'}</span> {scenario.example.withoutPlanning}</p>
                          <p className="text-black"><span className="font-semibold text-blue-700">{language === 'en' ? 'With Planning:' : '有规划：'}</span> {scenario.example.withPlanning}</p>
                          <p className="text-lg font-bold text-green-800 pt-2 border-t border-green-300">
                            {language === 'en' ? '💰 Savings: ' : '💰 节省：'}{scenario.example.savings}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
              <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                {t.services.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {t.services.items.map((service, index) => (
                  <div key={index} className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <h3 className="text-2xl font-bold text-black mb-2">{service.name}</h3>
                    <p className="text-xl text-blue-600 font-bold mb-4">{service.price}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-black">
                          <span className="text-blue-600 mt-1 flex-shrink-0">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator Info */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 md:p-12 text-white mb-8">
              <h2 className="text-3xl font-bold mb-6">{t.calculator.title}</h2>
              <p className="text-lg mb-6 text-indigo-100">{t.calculator.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {t.calculator.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-yellow-300 mt-1">▸</span>
                    <span className="text-sm text-indigo-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-200">
                  🔒 {t.calculator.accessNote}
                </p>
              </div>

              <button
                onClick={() => setShowCalculator(true)}
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all"
              >
                {t.cta}
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100">
          <div className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-4">
              <button
                onClick={() => setShowCalculator(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← {language === 'en' ? 'Back to Tax Planning Overview' : '返回税务规划概览'}
              </button>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <TaxCalculator isClient={true} />
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
