FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    curl \
    unzip \
 && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir spacy python-multipart

# Copiar el código
COPY . .

# Descargar y descomprimir el modelo Vosk grande directamente en /app
RUN curl -L -o model.zip "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip" \
    && unzip model.zip -d . \
    && rm model.zip

RUN apt-get update && apt-get install -y libsndfile1 && rm -rf /var/lib/apt/lists/*


# Descargar modelos spaCy (es_core_news_sm y es_core_news_md)
RUN python -m spacy download es_core_news_sm \
    && python -m spacy download es_core_news_md

# Puerto expuesto
EXPOSE 8000

# Comando para iniciar la app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
