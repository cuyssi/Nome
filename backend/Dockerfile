FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y git ffmpeg

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements.txt \
 && python -c "import faster_whisper; print('✅ faster-whisper instalado correctamente')"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]