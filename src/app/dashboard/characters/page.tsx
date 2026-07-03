'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/page-header';
import GlassCard from '@/components/ui/glass-card';
import GradientBtn from '@/components/ui/gradient-btn';
import EmptyState from '@/components/ui/empty-state';
import TagGroup from '@/components/ui/tag-group';
import { CardSkeleton } from '@/components/ui/loading-skeleton';

export default function CharactersPage() {
  const [searchText, setSearchText] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/characters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setCharacters(await res.json());
        } else {
          setError('加载角色失败');
        }
      } catch {
        setError('网络错误，请重试');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = characters.filter((c) => {
    const matchSearch = !searchText || c.name.includes(searchText);
    const matchGender = genderFilter === 'all' || c.gender === genderFilter;
    return matchSearch && matchGender;
  });

  return (
    <div>
      <PageHeader
        title="角色管理"
        actions={
          <Link href="/dashboard/characters/new">
            <GradientBtn>+ 创建角色</GradientBtn>
          </Link>
        }
      />

      {/* 搜索栏 */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索角色名称..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div className="flex gap-1.5">
            {[{ value: 'all', label: '全部' }, { value: '男', label: '男' }, { value: '女', label: '女' }].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGenderFilter(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  genderFilter === opt.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 角色列表 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <GlassCard className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <GradientBtn onClick={() => window.location.reload()}>重试</GradientBtn>
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <EmptyState
            title="暂无角色"
            description="开始创建你的第一个角色吧"
            actions={
              <Link href="/dashboard/characters/new">
                <GradientBtn>创建第一个角色</GradientBtn>
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((character) => (
            <Link href={`/dashboard/characters/${character.id}`} key={character.id}>
              <GlassCard hover className="h-full group">
                {/* 封面 */}
                <div className="h-36 -mx-4 -mt-4 mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-xl flex items-center justify-center overflow-hidden">
                  {character.avatarUrl ? (
                    <img src={character.avatarUrl} alt={character.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-[#00d4aa] flex items-center justify-center text-2xl font-bold text-white">
                      {character.name[0]}
                    </div>
                  )}
                </div>

                {/* 信息 */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white group-hover:text-brand-500 transition-colors">{character.name}</h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${character.gender === '男' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                    {character.gender === '男' ? '♂' : '♀'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate mb-3">{character.personality || '暂无描述'}</p>
                <TagGroup
                  tags={[
                    { key: 'gen', label: character.isAiGenerated ? 'AI 生成' : '手动创建', color: character.isAiGenerated ? 'purple' : 'gray' },
                    { key: 'style', label: character.style || '写实', color: 'cyan' },
                  ]}
                />
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
