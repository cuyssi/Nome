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
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Descargar y descomprimir el modelo Vosk grande
RUN curl -L -o model.zip "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip" && \
    unzip model.zip -d backend/ && \
    rm model.zip

# Puerto expuesto
EXPOSE 8000

# Comando para iniciar la app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
