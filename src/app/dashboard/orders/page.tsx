'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface OrderItem {
  id: string; orderNo: string; amount: number; status: string;
  paidAt?: string; createdAt: string;
  template?: { id: string; title: string; coverUrl?: string };
}

const statusMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'text-yellow-400 bg-yellow-500/20', label: '待支付' },
  PAID: { color: 'text-green-400 bg-green-500/20', label: '已支付' },
  REFUNDED: { color: 'text-red-400 bg-red-500/20', label: '已退款' },
  CANCELLED: { color: 'text-gray-400 bg-gray-500/20', label: '已取消' },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (activeTab !== 'all') params.set('status', activeTab.toUpperCase());
        const res = await fetch(`/api/orders?${params.toString()}`);
        if (res.status === 401) {
          setOrders([]);
          return;
        }
        if (!res.ok) throw new Error('加载失败');
        const data = await res.json();
        setOrders(data.data || []);
      } catch (err: any) {
        setError(err.message || '加载订单失败');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const tabs = [
    { key: 'all', label: '全部订单' },
    { key: 'paid', label: '已支付' },
    { key: 'pending', label: '待支付' },
  ];

  return (
    <div>
      <PageHeader
        title="我的订单"
        subtitle="管理你的模板购买记录"
        breadcrumbs={[{ label: '发现首页', href: '/dashboard' }, { label: '我的订单' }]}
      />

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

      <GlassCard className="overflow-hidden !p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#c084fc' }} spin />} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="还没有订单"
              description="去模板市场选购心仪的模板"
              actions={
                <Link href="/dashboard/market">
                  <GradientBtn variant="market">浏览模板市场</GradientBtn>
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
                {orders.map((order) => {
                  const st = statusMap[order.status] || { color: 'text-gray-400 bg-gray-500/20', label: order.status };
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300 font-mono">{order.orderNo}</td>
                      <td className="px-6 py-4 text-sm text-white">{order.template?.title || '未知模板'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#00d4aa]">¥{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.paidAt ? new Date(order.paidAt).toLocaleString('zh-CN') : '-'}</td>
                      <td className="px-6 py-4">
                        {order.status === 'PAID' && (
                          <button className="flex items-center gap-1.5 text-sm text-[#5b2eff] hover:text-[#7b5eff] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            下载模板
                          </button>
                        )}
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
