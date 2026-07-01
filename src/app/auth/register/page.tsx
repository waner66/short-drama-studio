'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, PlayCircleOutlined, ArrowLeftOutlined, GiftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    username: string;
    phone?: string;
    email?: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }
    setLoading(true);
    try {
      let user;
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (res.ok) {
          user = data.user;
          localStorage.setItem('token', data.token);
        } else {
          throw new Error(data.error);
        }
      } catch {
        const { userService } = await import('@/lib/store/data-service');
        const storedUser = userService.register(
          values.username,
          values.password,
          values.email,
          values.phone
        );
        user = {
          id: storedUser.id,
          username: storedUser.username,
          email: storedUser.email || null,
          phone: storedUser.phone || null,
          avatarUrl: storedUser.avatarUrl || null,
          role: storedUser.role,
        };
        localStorage.setItem('token', 'local-' + storedUser.id);
      }

      localStorage.setItem('user', JSON.stringify(user));
      message.success('注册成功！已赠送免费额度，开始创作吧');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px]" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-brand-500/8 rounded-full blur-[96px]" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent-500/6 rounded-full blur-[96px]" />

      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button type="text" icon={<ArrowLeftOutlined />} className="!text-[#6b6b8a] hover:!text-white">
          返回首页
        </Button>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass px-8 py-10 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-6 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <PlayCircleOutlined className="text-white text-lg" />
            </div>
          </Link>
          <div className="text-center mb-6">
            <Title level={3} className="!text-white !mb-2">注册短剧工坊</Title>
            <Text className="!text-[#6b6b8a]">加入 1,200+ 创作者社区</Text>
          </div>

          {/* Gift banner */}
          <div className="bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <GiftOutlined className="text-accent-500 text-xl mt-0.5" />
            <div>
              <div className="text-white font-semibold text-sm mb-1">注册即送免费额度</div>
              <div className="text-[#6b6b8a] text-xs">
                AI剧本生成 x3 · 角色形象生成 x5 · 视频导出 x1
              </div>
            </div>
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 2, max: 20, message: '用户名长度为2-20个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="!text-[#6b6b8a]" />}
                placeholder="用户名"
                className="!h-12 !bg-[#0e0e20] !border-[#1e1e3a] !text-white !rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
            >
              <Input
                prefix={<PhoneOutlined className="!text-[#6b6b8a]" />}
                placeholder="手机号 (选填)"
                className="!h-12 !bg-[#0e0e20] !border-[#1e1e3a] !text-white !rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
            >
              <Input
                prefix={<MailOutlined className="!text-[#6b6b8a]" />}
                placeholder="邮箱 (选填)"
                className="!h-12 !bg-[#0e0e20] !border-[#1e1e3a] !text-white !rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="!text-[#6b6b8a]" />}
                placeholder="密码 (至少6位)"
                className="!h-12 !rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[{ required: true, message: '请确认密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="!text-[#6b6b8a]" />}
                placeholder="确认密码"
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
                注册并开始创作
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text className="!text-[#6b6b8a]">
              已有账号？{' '}
              <Link href="/auth/login" className="!text-brand-400 hover:!text-brand-300 font-medium">
                立即登录
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
