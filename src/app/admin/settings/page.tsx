'use client';

import { Card, Form, InputNumber, Button, Typography, Switch, Divider, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminSettingsPage() {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('设置已保存');
  };

  return (
    <div>
      <Title level={4} className="!mb-6">系统设置</Title>

      <Card title="抽成配置" className="mb-4">
        <Form form={form} layout="vertical" initialValues={{ commission: 15, minPayout: 50 }}>
          <Form.Item name="commission" label="平台抽成比例 (%)">
            <InputNumber min={0} max={50} suffix="%" className="!w-48" />
          </Form.Item>
          <Text type="secondary" className="block mb-4">
            创作者实际获得：售价 × (100% - 抽成比例)
          </Text>

          <Form.Item name="minPayout" label="最低提现金额 (¥)">
            <InputNumber min={0} max={10000} className="!w-48" />
          </Form.Item>

          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存设置</Button>
        </Form>
      </Card>

      <Card title="功能开关" className="mb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Text strong>模板市场</Text><br /><Text type="secondary">开启后用户可浏览和购买模板</Text></div>
            <Switch defaultChecked />
          </div>
          <Divider className="!my-2" />
          <div className="flex items-center justify-between">
            <div><Text strong>AI 生成功能</Text><br /><Text type="secondary">开启后用户可使用 AI 创作助手</Text></div>
            <Switch defaultChecked />
          </div>
          <Divider className="!my-2" />
          <div className="flex items-center justify-between">
            <div><Text strong>用户注册</Text><br /><Text type="secondary">关闭后禁止新用户注册</Text></div>
            <Switch defaultChecked />
          </div>
          <Divider className="!my-2" />
          <div className="flex items-center justify-between">
            <div><Text strong>调试模式</Text><br /><Text type="secondary">开启后 API 响应会包含调试信息</Text></div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card title="免费额度配置">
        <Form layout="vertical" initialValues={{ textGen: 3, imageGen: 5, charGen: 3, sceneImg: 3, tts: 500, videoExport: 1 }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Form.Item name="textGen" label="AI 剧本生成 (次)"><InputNumber min={0} className="!w-full" /></Form.Item>
            <Form.Item name="imageGen" label="AI 图片生成 (张)"><InputNumber min={0} className="!w-full" /></Form.Item>
            <Form.Item name="charGen" label="角色设定生成 (次)"><InputNumber min={0} className="!w-full" /></Form.Item>
            <Form.Item name="sceneImg" label="场景画面生成 (张)"><InputNumber min={0} className="!w-full" /></Form.Item>
            <Form.Item name="tts" label="TTS 额度 (字)"><InputNumber min={0} className="!w-full" /></Form.Item>
            <Form.Item name="videoExport" label="视频导出 (次)"><InputNumber min={0} className="!w-full" /></Form.Item>
          </div>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存额度</Button>
        </Form>
      </Card>
    </div>
  );
}
