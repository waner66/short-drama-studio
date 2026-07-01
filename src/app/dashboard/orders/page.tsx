'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';

const mockOrders = [
  { id: '1', orderNo: 'OD20260628001', templateTitle: '霸道总裁爱上我 · 短剧模板', amount: 29.9, status: 'PAID', paidAt: '2026-06-28 14:30' },
  { id: '2', orderNo: 'OD20260615001', templateTitle: '穿越古代当首富 · 完整模板', amount: 49.9, status: 'PAID', paidAt: '2026-06-15 10:20' },
];

const statusMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'text-yellow-400 bg-yellow-500/20', label: '待支付' },
  PAID: { color: 'text-green-400 bg-green-500/20', label: '已支付' },
  REFUNDED: { color: 'text-red-400 bg-red-500/20', label: '已退款' },
  CANCELLED: { color: 'text-gray-400 bg-gray-500/20', label: '已取消' },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { key: 'all', label: '全部订单' },
    { key: 'paid', label: '已支付' },
    { key: 'pending', label: '待支付' },
  ];

  const filtered = activeTab === 'all'
    ? mockOrders
    : mockOrders.filter((o) => o.status === (activeTab === 'paid' ? 'PAID' : 'PENDING'));

  return (
    <div>
      <PageHeader title="我的订单" />

      {/* 自定义 Tab 栏 */}
      <div className="flex gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#5b2eff] text-white shadow-lg shadow-[#5b2eff]/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 订单表格 */}
      <GlassCard className="overflow-hidden !p-0">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="还没有订单"
              description="去模板市场选购心仪的模板"
              actions={
                <Link href="/dashboard/market">
                  <GradientBtn>浏览模板市场</GradientBtn>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['订单号', '模板名称', '金额', '状态', '购买时间', '操作'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const st = statusMap[order.status];
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300 font-mono">{order.orderNo}</td>
                      <td className="px-6 py-4 text-sm text-white">{order.templateTitle}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#00d4aa]">¥{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.paidAt}</td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1.5 text-sm text-[#5b2eff] hover:text-[#7b5eff] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          下载模板
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
