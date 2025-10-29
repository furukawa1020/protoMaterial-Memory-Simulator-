# 🌿 自然素材の非線形遅延特性シミュレーションアプリ

**Material Memory Simulator** - 自然素材が持つ非線形遅延（記憶・余韻）を体験・分析するWebアプリ

## コンセプト

素材（木、金属、布、土、水）が刺激（熱、圧力、音、光）に対してどのように「記憶」し、
「余韻」を残すかを、情報理論と非線形動力学でシミュレーション。

## 技術スタック

- **フロントエンド**: Next.js (React + TypeScript + Tailwind CSS)
- **可視化**: Plotly.js + D3.js
- **音響**: Tone.js
- **バックエンド**: FastAPI (Python)
- **数値計算**: NumPy + SciPy

## プロジェクト構造

```
similation/
├── frontend/          # Next.js アプリ
│   ├── src/
│   │   ├── app/       # App Router
│   │   ├── components/
│   │   ├── lib/       # ユーティリティ・型定義
│   │   └── styles/
│   └── package.json
├── backend/           # FastAPI サーバー
│   ├── main.py
│   ├── models/        # 素材モデル
│   ├── simulation/    # シミュレーションエンジン
│   └── requirements.txt
└── docs/              # 研究資料・ポスター
```

## クイックスタート

### バックエンド起動
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### フロントエンド起動
```bash
cd frontend
npm install
npm run dev
```

→ ブラウザで `http://localhost:3000` を開く

## 開発タイムライン（1日）

- [x] 要件定義・構造設計
- [ ] Pythonモデル構築
- [ ] React UI実装
- [ ] 可視化・音響実装
- [ ] デプロイ

## ライセンス

MIT License - 研究・教育目的での使用を推奨
