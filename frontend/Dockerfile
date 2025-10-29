# Node.js 18ベース（LTS版）
FROM node:18-alpine

# 作業ディレクトリ
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー（キャッシュ最適化）
COPY package*.json ./

# 依存関係インストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# Next.jsビルド（本番用の場合。開発用はdevサーバー起動）
# RUN npm run build

# ポート公開
EXPOSE 3000

# 開発サーバー起動（0.0.0.0でバインド）
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
