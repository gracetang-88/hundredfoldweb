'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MTMWorkpaper from '@/components/MTMWorkpaper';
import TaxPrepChecklist from '@/components/TaxPrepChecklist';
import TaxPricingEstimator from '@/components/TaxPricingEstimator';
import { useLanguage } from '@/lib/LanguageContext';

export default function TaxToolsPage() {
  const { language } = useLanguage();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # character
    if (hash === 'mtm-workpaper') {
      setSelectedTool('mtm');
    } else if (hash === 'tax-prep-checklist') {
      setSelectedTool('checklist');
    } else if (hash === 'pricing') {
      setSelectedTool('pricing');
    }
  }, []);

  const tools = [
    {
      id: 'pricing',
      nameEn: 'Tax Service Pricing',
      nameZh: '税务服务报价',
      descriptionEn: 'Get an estimated price for your tax filing needs. Approximate pricing based on your tax situation.',
      descriptionZh: '获取税务申报服务的预估价格。根据您的税务情况提供大致报价。',
      icon: '💰',
    },
    {
      id: 'mtm',
      nameEn: 'MTM Workpaper Estimator',
      nameZh: 'MTM 工作底稿估算工具',
      descriptionEn: 'IRC §475(f) Mark-to-Market estimate tool for day traders. Final filing accuracy must be verified by taxpayer.',
      descriptionZh: 'IRC §475(f) 按市价计价估算工具，专为日间交易者设计。最终申报准确性需由报税者确认。',
      icon: '📊',
    },
    {
      id: 'checklist',
      nameEn: 'Tax Prep Checklist',
      nameZh: '税务准备清单',
      descriptionEn: 'Complete document collection checklist for first-year MTM engagement with Section 481(a) adjustment.',
      descriptionZh: '首年 MTM 申报的完整文档收集清单，包含 Section 481(a) 调整要求。',
      icon: '✓',
    },
  ];

  const content = {
    title: language === 'en' ? 'Tax Tools for Day Traders' : '日间交易者税务工具',
    subtitle: language === 'en'
      ? 'Professional tax calculation and compliance tools designed specifically for active traders'
      : '专为活跃交易者设计的专业税务计算和合规工具',
    selectTool: language === 'en' ? 'Select a tool to get started' : '选择一个工具开始使用',
    intro: {
      title: language === 'en' ? 'Day Trader Tax Compliance' : '日间交易者税务合规',
      sections: language === 'en' ? [
        {
          title: 'Understanding Mark-to-Market Election',
          content: 'Day traders who qualify as traders in securities (not investors) can elect Mark-to-Market (MTM) accounting under IRC §475(f). This election treats all positions as ordinary income/loss rather than capital gains, offering significant tax advantages for active traders.'
        },
        {
          title: 'Key Benefits of MTM Election',
          points: [
            'Convert capital losses to ordinary losses - deduct unlimited amounts against ordinary income',
            'Avoid the $3,000 annual capital loss limitation',
            'Exempt from wash sale rules under IRC §1091',
            'Recognize year-end unrealized gains/losses for better tax planning',
            'All trading activity reported as ordinary income on Form 4797'
          ]
        },
        {
          title: 'Our Tools',
          tools: [
            {
              name: 'Tax Service Pricing',
              description: 'Get an estimated price for your tax filing needs based on your specific situation.',
              features: [
                'Individual and business tax return pricing',
                'Interactive questionnaire for accurate estimates',
                'Transparent pricing breakdown',
                'Approximate pricing - final quote after consultation'
              ]
            },
            {
              name: 'MTM Workpaper Estimator',
              description: 'Calculate and document your mark-to-market reconciliation, including the critical Section 481(a) adjustment required in your first MTM year.',
              features: [
                'Step-by-step Section 481(a) adjustment calculation',
                'Year-end MTM reconciliation with unrealized gain/loss tracking',
                'Form 4797 Part II summary for tax return preparation',
                'CSV import from TradeLog or manual position entry'
              ]
            },
            {
              name: 'Tax Prep Checklist',
              description: 'Complete document collection checklist for first-year MTM engagement ensuring you have all required materials.',
              features: [
                'Election documentation verification',
                'Section 481(a) adjustment materials',
                'Current-year MTM data requirements',
                'Key tax issues and compliance reminders'
              ]
            }
          ]
        }
      ] : [
        {
          title: '了解按市价计价选举',
          content: '符合证券交易者资格（非投资者）的日间交易者可以根据 IRC §475(f) 选择按市价计价 (MTM) 会计处理。此选举将所有持仓视为普通收入/损失而非资本利得，为活跃交易者提供显著的税务优势。'
        },
        {
          title: 'MTM 选举的主要优势',
          points: [
            '将资本损失转换为普通损失 - 可以无限额抵扣普通收入',
            '避免每年 $3,000 的资本损失限额',
            '免受 IRC §1091 洗售规则的限制',
            '确认年末未实现损益，便于税务规划',
            '所有交易活动作为普通收入在 Form 4797 上报告'
          ]
        },
        {
          title: '我们的工具',
          tools: [
            {
              name: '税务服务报价',
              description: '根据您的具体情况获取税务申报服务的预估价格。',
              features: [
                '个人和企业税务申报定价',
                '互动问卷获取准确估价',
                '透明的价格明细',
                '大致报价 - 咨询后确认最终价格'
              ]
            },
            {
              name: 'MTM 工作底稿估算工具',
              description: '计算和记录按市价计价对账，包括首个 MTM 年度所需的关键 Section 481(a) 调整。',
              features: [
                '分步 Section 481(a) 调整计算',
                '年末 MTM 对账，跟踪未实现损益',
                'Form 4797 Part II 税务申报摘要',
                '从 TradeLog 导入 CSV 或手动输入持仓'
              ]
            },
            {
              name: '税务准备清单',
              description: '首年 MTM 申报的完整文档收集清单，确保您拥有所有必需材料。',
              features: [
                '选举文件验证',
                'Section 481(a) 调整材料',
                '当前年度 MTM 数据要求',
                '关键税务问题和合规提醒'
              ]
            }
          ]
        }
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {!selectedTool ? (
        <main className="flex-1 py-16 bg-gradient-to-br from-blue-50/30 via-gray-50 to-purple-50/30">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-black mb-4">
                {content.title}
              </h1>
              <p className="text-xl text-black max-w-3xl mx-auto">
                {content.subtitle}
              </p>
            </div>

            {/* Introduction Content */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                {content.intro.title}
              </h2>

              {content.intro.sections.map((section, index) => (
                <div key={index} className="mb-10 last:mb-0">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">
                    {section.title}
                  </h3>
                  {section.content && (
                    <p className="text-black leading-relaxed mb-4 text-lg">
                      {section.content}
                    </p>
                  )}
                  {section.points && (
                    <ul className="space-y-3">
                      {section.points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-3 text-xl flex-shrink-0">✓</span>
                          <span className="text-black text-lg">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.tools && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {section.tools.map((tool, toolIdx) => (
                        <button
                          key={toolIdx}
                          onClick={() => setSelectedTool(toolIdx === 0 ? 'pricing' : toolIdx === 1 ? 'mtm' : 'checklist')}
                          className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-600 rounded-xl p-6 text-left transition-all hover:shadow-lg group"
                        >
                          <h4 className="text-xl font-bold text-blue-700 mb-3 group-hover:text-blue-800">
                            {tool.name} →
                          </h4>
                          <p className="text-black mb-4 text-sm leading-relaxed">
                            {tool.description}
                          </p>
                          <ul className="space-y-2">
                            {tool.features.map((feature, featureIdx) => (
                              <li key={featureIdx} className="flex items-start text-sm">
                                <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                                <span className="text-black">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1">
          <div className="bg-gray-100 border-b border-gray-200 py-4">
            <div className="container mx-auto px-4">
              <button
                onClick={() => setSelectedTool(null)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← {language === 'en' ? 'Back to Tool Selection' : '返回工具选择'}
              </button>
            </div>
          </div>

          {selectedTool === 'pricing' && <TaxPricingEstimator />}
          {selectedTool === 'mtm' && <MTMWorkpaper />}
          {selectedTool === 'checklist' && <TaxPrepChecklist />}
        </main>
      )}

      <Footer />
    </div>
  );
}
