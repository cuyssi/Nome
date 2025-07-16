import whisper
from fastapi import UploadFile

model = whisper.load_model("medium")
async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()

    with open("temp_audio.mp3", "wb") as f:
        f.write(audio_bytes)

    result = model.transcribe("temp_audio.mp3")

    if isinstance(result, dict) and "text" in result and isinstance(result["text"], (str, list)):
        if isinstance(result["text"], list):
            return " ".join(result["text"]).strip()
        return result["text"].strip()

    return ""
