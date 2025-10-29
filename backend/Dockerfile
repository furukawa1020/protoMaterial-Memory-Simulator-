# Python 3.11ベース（公式slim版で軽量化）
FROM python:3.11-slim

# 作業ディレクトリ
WORKDIR /app

# システムパッケージ更新（gcc等、SciPyビルドに必要）
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    gfortran \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Pythonパッケージのインストール（キャッシュ活用のため先にrequirements）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# ポート公開
EXPOSE 8000

# サーバー起動（本番用はuvicorn、開発用は--reload付き）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
