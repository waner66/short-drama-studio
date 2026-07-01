#!/bin/bash
# 短剧工坊 - 一键部署脚本
# 适用于阿里云 ECS (Ubuntu 22.04)

set -e

echo "=========================================="
echo "  短剧工坊 部署脚本"
echo "=========================================="

# 检查环境
command -v docker >/dev/null 2>&1 || { echo "请先安装 Docker"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo "请先安装 Docker Compose"; exit 1; }

# 复制环境变量
if [ ! -f .env ]; then
  cp .env.example .env
  echo "已创建 .env 文件，请填入真实配置后重新运行"
  exit 1
fi

# 构建并启动
echo "[1/4] 构建镜像..."
docker compose build

echo "[2/4] 运行数据库迁移..."
docker compose run --rm nextjs-app npx prisma db push

echo "[3/4] 启动服务..."
docker compose up -d

echo "[4/4] 健康检查..."
sleep 5
curl -sf http://localhost:3000 >/dev/null && echo "  Next.js :3000 OK" || echo "  Next.js :3000 FAIL"
curl -sf http://localhost:8000/api/video/health >/dev/null 2>&1 && echo "  FastAPI :8000 OK" || echo "  FastAPI :8000 (not deployed yet)"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  访问: http://localhost"
echo "=========================================="
