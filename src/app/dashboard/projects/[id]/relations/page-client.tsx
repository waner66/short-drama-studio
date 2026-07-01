'use client';

import { useState } from 'react';
import { Card, Button, Typography, Space, Tag, Select, Input, Modal, message, Row, Col } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import RelationGraph from '@/components/ui/relation-graph';
import Link from 'next/link';

const { Title, Text } = Typography;

const RELATION_TYPES = ['恋爱', '敌对', '朋友', '家人', '上下级', '秘密', '前世', '单恋', '商业'];

export default function RelationsClient({ params }: { params: { id: string } }) {
  const [characters] = useState([
    { id: 'c1', name: '林小羽', archetype: '甜宠女主', gender: '女' },
    { id: 'c2', name: '陈墨', archetype: '霸总', gender: '男' },
    { id: 'c3', name: '苏婉儿', archetype: '恶毒女配', gender: '女' },
    { id: 'c4', name: '赵明', archetype: '搞笑担当', gender: '男' },
  ]);

  const [relations, setRelations] = useState([
    { id: 'r1', characterAId: 'c1', characterBId: 'c2', relationType: '恋爱', description: '穿越时空的恋人' },
    { id: 'r2', characterAId: 'c1', characterBId: 'c4', relationType: '朋友', description: '青梅竹马好闺蜜' },
    { id: 'r3', characterAId: 'c2', characterBId: 'c3', relationType: '商业', description: '家族联姻对象' },
    { id: 'r4', characterAId: 'c1', characterBId: 'c3', relationType: '敌对', description: '情敌+商战对手' },
  ]);

  const [addModal, setAddModal] = useState(false);
  const [newRelation, setNewRelation] = useState({ characterAId: '', characterBId: '', relationType: '恋爱', description: '' });

  const handleAdd = () => {
    if (!newRelation.characterAId || !newRelation.characterBId || newRelation.characterAId === newRelation.characterBId) {
      message.warning('请选择两个不同的角色');
      return;
    }
    setRelations([...relations, { id: 'r' + Date.now(), ...newRelation }]);
    setAddModal(false);
    setNewRelation({ characterAId: '', characterBId: '', relationType: '恋爱', description: '' });
    message.success('关系已添加');
  };

  const handleDeleteRelation = (id: string) => {
    setRelations(relations.filter(r => r.id !== id));
  };

  const handleAddRelation = (a: string) => {
    setNewRelation(prev => ({ ...prev, characterAId: a }));
    setAddModal(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Link href={`/dashboard/projects/${params.id}`}>
            <Button icon={<ArrowLeftOutlined />} type="text">返回项目</Button>
          </Link>
          <Title level={4} className="!mb-0">角色关系图</Title>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>添加关系</Button>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Card bodyStyle={{ height: 520, padding: 8 }}>
            <RelationGraph characters={characters} relations={relations} onAddRelation={handleAddRelation} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="关系列表" bodyStyle={{ height: 520, overflow: 'auto' }}>
            {relations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">还没有关系，点击右上角添加</div>
            ) : (
              <div className="space-y-2">
                {relations.map(r => {
                  const a = characters.find(c => c.id === r.characterAId);
                  const b = characters.find(c => c.id === r.characterBId);
                  return (
                    <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-sm">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Text strong className="truncate">{a?.name || '?'}</Text>
                        <Tag color={r.relationType === '恋爱' ? 'red' : r.relationType === '敌对' ? 'orange' : 'blue'} className="!text-xs !m-0">{r.relationType}</Tag>
                        <Text strong className="truncate">{b?.name || '?'}</Text>
                      </div>
                      <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteRelation(r.id)} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal title="添加角色关系" open={addModal} onOk={handleAdd} onCancel={() => setAddModal(false)} okText="添加">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">角色 A</label>
              <Select value={newRelation.characterAId || undefined} onChange={v => setNewRelation({ ...newRelation, characterAId: v })}
                style={{ width: '100%' }} placeholder="选择角色"
                options={characters.map(c => ({ value: c.id, label: `${c.name} (${c.archetype || ''})` }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">角色 B</label>
              <Select value={newRelation.characterBId || undefined} onChange={v => setNewRelation({ ...newRelation, characterBId: v })}
                style={{ width: '100%' }} placeholder="选择角色"
                options={characters.map(c => ({ value: c.id, label: `${c.name} (${c.archetype || ''})` }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">关系类型</label>
            <Select value={newRelation.relationType} onChange={v => setNewRelation({ ...newRelation, relationType: v })}
              style={{ width: '100%' }}
              options={RELATION_TYPES.map(t => ({ value: t, label: t }))} />
          </div>
          <div>
            <label className="block text-sm mb-1">关系描述</label>
            <Input value={newRelation.description} onChange={e => setNewRelation({ ...newRelation, description: e.target.value })}
              placeholder="例：穿越时空的恋人" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
