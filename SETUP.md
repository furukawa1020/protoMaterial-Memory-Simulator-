# Material Memory Simulator - セットアップガイド

## 🚀 セットアップ手順

### 1. バックエンド（Python）

```powershell
# backendディレクトリに移動
cd backend

# 仮想環境作成（推奨）
python -m venv venv
.\venv\Scripts\Activate.ps1

# 依存関係インストール
pip install -r requirements.txt

# サーバー起動
python main.py
```

→ バックエンドが http://localhost:8000 で起動します

### 2. フロントエンド（Next.js）

```powershell
# frontendディレクトリに移動
cd frontend

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

→ フロントエンドが http://localhost:3000 で起動します

### 3. ブラウザでアクセス

http://localhost:3000 を開く

---

## 📖 使い方

1. **素材を選択**（木材、金属、布、土、水）
2. **刺激タイプを選択**（熱、圧力、音、光など）
3. **パラメータ調整**（持続時間、強度、周波数）
4. **シミュレーション開始**をクリック
5. グラフと解析結果を確認

---

## 🎯 デプロイ

### Vercelへのデプロイ（フロントエンド）

```bash
cd frontend
npm install -g vercel
vercel
```

### Renderへのデプロイ（バックエンド）

1. Render.comでアカウント作成
2. 「New Web Service」を選択
3. GitHubリポジトリを接続
4. `backend`ディレクトリを指定
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
