# 🐳 Docker クイックスタートガイド

## 前提条件

- Docker Desktop for Windows がインストールされていること
- Docker Desktop が起動していること

## 🚀 起動手順（たった1コマンド）

プロジェクトルートで以下を実行：

```powershell
docker-compose up --build
```

初回は10-15分かかります（Python/Node.jsイメージのダウンロード、パッケージインストール）。
2回目以降は数秒で起動します。

## 📱 アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **APIドキュメント**: http://localhost:8000/docs

## 🛑 停止

```powershell
# Ctrl+C でターミナルで停止
# または
docker-compose down
```

## 🔄 再ビルド（コード変更後）

```powershell
# フル再ビルド
docker-compose up --build

# バックエンドのみ
docker-compose up --build backend

# フロントエンドのみ
docker-compose up --build frontend
```

## 🧹 完全クリーンアップ

```powershell
# コンテナ・ボリューム・ネットワークをすべて削除
docker-compose down -v --rmi all
```

## 📊 ログ確認

```powershell
# すべてのログ
docker-compose logs -f

# バックエンドのみ
docker-compose logs -f backend

# フロントエンドのみ
docker-compose logs -f frontend
```

## ⚙️ トラブルシューティング

### ポートが既に使用されている

```powershell
# 8000または3000ポートを使用しているプロセスを確認
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# プロセスIDがわかったら終了（管理者権限必要）
taskkill /PID <プロセスID> /F
```

### Docker Desktopが起動していない

- タスクバーからDocker Desktopアイコンを確認
- 起動していない場合は、スタートメニューから起動

### ビルドエラー

```powershell
# キャッシュをクリアして再ビルド
docker-compose build --no-cache
docker-compose up
```

## 💡 開発時のTips

### ホットリロード

- バックエンド: `uvicorn --reload` により自動リロード
- フロントエンド: Next.js Fast Refreshにより自動リロード
- ファイルを保存するだけで変更が反映されます

### コンテナ内に入る

```powershell
# バックエンドコンテナに入る
docker-compose exec backend bash

# フロントエンドコンテナに入る（Alpine Linuxなのでshellはsh）
docker-compose exec frontend sh
```

### ローカルファイルとの同期

- `volumes:` 設定により、ローカルの変更が即座にコンテナに反映されます
- `node_modules` と `.next` は除外されているため、ビルド成果物が競合しません

## 🎯 本番デプロイ用（参考）

```powershell
# 本番用ビルド（--reloadなし）
docker-compose -f docker-compose.prod.yml up --build
```

（`docker-compose.prod.yml` を作成する場合は別途お知らせください）

---

## 📦 含まれるサービス

| サービス | ポート | 説明 |
|---------|--------|------|
| backend | 8000 | FastAPI + NumPy + SciPy（フル環境） |
| frontend | 3000 | Next.js + React + Tailwind CSS |

---

**✅ これでローカルPCに直接インストールせずに、フル機能の研究環境が利用できます！**
