'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, WechatOutlined, PlayCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');

  const onFinish = async (values: { phone?: string; email?: string; password: string }) => {
    setLoading(true);
    try {
      // 只发送当前模式对应的字段
      const payload = loginMode === 'phone'
        ? { phone: values.phone, password: values.password }
        : { email: values.email, password: values.password };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // 保存 token 和用户信息到 localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        message.success('登录成功！');
        window.location.href = '/dashboard';
      } else {
        message.error(data.error || data.detail || '登录失败');
      }
    } catch {
      message.error('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px]" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-brand-500/8 rounded-full blur-[96px]" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent-500/6 rounded-full blur-[96px]" />

      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button type="text" icon={<ArrowLeftOutlined />} className="!text-[var(--text-muted)] hover:!text-white">
          返回首页
        </Button>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass px-8 py-10 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-8 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <PlayCircleOutlined className="text-white text-lg" />
            </div>
          </Link>
          <div className="text-center mb-8">
            <Title level={3} className="!text-white !mb-2">欢迎回来</Title>
            <Text className="!text-[var(--text-muted)]">登录你的短剧工坊账号</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            {loginMode === 'phone' ? (
              <Form.Item
                name="phone"
                preserve={false}
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="!text-[var(--text-muted)]" />}
                  placeholder="手机号"
                  className="!h-12 !bg-[var(--surface-ground)] !border-[var(--border-subtle)] !text-white !rounded-xl"
                />
              </Form.Item>
            ) : (
              <Form.Item
                name="email"
                preserve={false}
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="!text-[var(--text-muted)]" />}
                  placeholder="邮箱地址"
                  className="!h-12 !bg-[var(--surface-ground)] !border-[var(--border-subtle)] !text-white !rounded-xl"
                />
              </Form.Item>
            )}

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="!text-[var(--text-muted)]" />}
                placeholder="密码"
                className="!h-12 !rounded-xl"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="!h-12 !text-base !font-semibold !rounded-xl"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mb-4">
            <Button
              type="link"
              onClick={() => setLoginMode(loginMode === 'phone' ? 'email' : 'phone')}
              className="!text-brand-400 hover:!text-brand-300"
            >
              {loginMode === 'phone' ? '使用邮箱登录' : '使用手机号登录'}
            </Button>
          </div>

          <Divider className="!border-[var(--border-subtle)]" plain>
            <Text className="!text-[var(--text-muted)] text-xs">其他登录方式</Text>
          </Divider>

          <div className="text-center mb-6">
            <Button
              icon={<WechatOutlined />}
              size="large"
              className="!rounded-xl !h-11 !bg-[var(--surface-ground)] !border-[var(--border-subtle)] !text-[var(--text-secondary)] hover:!border-green-500 hover:!text-green-400 !px-8"
              disabled
            >
              微信登录 (即将上线)
            </Button>
          </div>

          <div className="text-center">
            <Text className="!text-[var(--text-muted)]">
              还没有账号？{' '}
              <Link href="/auth/register" className="!text-brand-400 hover:!text-brand-300 font-medium">
                立即注册
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
