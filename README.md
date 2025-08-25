# Flask + PostgreSQL + Docker 基本アプリ

Flask（バックエンド）とPostgreSQL（データベース）をDockerで立ち上げる基本構成

## 起動コマンド

### バックエンド + DB（Docker）
```bash
# git clone後
cd hackson
docker-compose up --build

# バックグラウンド起動
docker-compose up -d --build
```

### フロントエンド（手動起動）
```bash
# 別ターミナルで
cd hackson/frontend
npm install
npm run dev
```

## アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000
- PostgreSQL: localhost:5432

## 停止
```bash
# Docker停止
docker-compose down

# フロントエンド停止
Ctrl + C
```