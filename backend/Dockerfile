FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para paquetes Python
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    curl \
    unzip \
    libsndfile1 \
    build-essential \
    libffi-dev \
    libssl-dev \
 && rm -rf /var/lib/apt/lists/*

# Actualizar pip, setuptools y wheel
RUN pip install --upgrade pip setuptools wheel

# Copiar requirements.txt primero
COPY requirements.txt .

# Instalar dependencias de Python (incluye pywebpush)
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir spacy python-multipart

# Copiar el código
COPY . .

# Descargar y descomprimir el modelo Vosk grande directamente en /app
RUN curl -L -o model.zip "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip" \
    && unzip -o model.zip -d vosk-model \
    && rm model.zip

# Descargar modelos spaCy (es_core_news_sm y es_core_news_md)
RUN python -m spacy download es_core_news_sm \
    && python -m spacy download es_core_news_md

# Puerto expuesto
EXPOSE 8000

# Comando para iniciar la app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
