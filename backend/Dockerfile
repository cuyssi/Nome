FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    curl \
    unzip \
 && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Descargar modelos de SpaCy
RUN python -m spacy download es_core_news_sm && \
    python -m spacy download es_core_news_md

# Copiar el código fuente
COPY . .

# Descargar modelo Vosk grande
RUN curl -L -o model.zip "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip" && \
    unzip model.zip -d . && \
    rm model.zip

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
