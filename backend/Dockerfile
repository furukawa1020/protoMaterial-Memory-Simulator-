# Python 3.11繝吶・繧ｹ・亥・蠑峻lim迚医〒霆ｽ驥丞喧・・
FROM python:3.11-slim

# 菴懈･ｭ繝・ぅ繝ｬ繧ｯ繝医Μ
WORKDIR /app

# 繧ｷ繧ｹ繝・Β繝代ャ繧ｱ繝ｼ繧ｸ譖ｴ譁ｰ・・cc遲峨ヾciPy繝薙Ν繝峨↓蠢・ｦ・ｼ・
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    gfortran \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Python繝代ャ繧ｱ繝ｼ繧ｸ縺ｮ繧､繝ｳ繧ｹ繝医・繝ｫ・医く繝｣繝・す繝･豢ｻ逕ｨ縺ｮ縺溘ａ蜈医↓requirements・・
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 繧｢繝励Μ繧ｱ繝ｼ繧ｷ繝ｧ繝ｳ繧ｳ繝ｼ繝峨ｒ繧ｳ繝斐・
COPY . .

# 繝昴・繝亥・髢・
EXPOSE 8000

# 繧ｵ繝ｼ繝舌・襍ｷ蜍包ｼ域悽逡ｪ逕ｨ縺ｯuvicorn縲・幕逋ｺ逕ｨ縺ｯ--reload莉倥″・・
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
