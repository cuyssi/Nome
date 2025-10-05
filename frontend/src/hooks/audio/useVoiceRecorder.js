/**─────────────────────────────────────────────────────────────────────────────
 * useVoiceRecorder: hook para grabar audio con el micrófono del usuario.
 *
 * Funcionalidad:
 *   • Permite iniciar, detener y alternar la grabación de audio.
 *   • Reproduce un beep al iniciar y al finalizar la grabación.
 *   • Devuelve el audio como Blob y como File listo para enviar o guardar.
 *   • Gestiona internamente el MediaRecorder y AudioContext.
 *
 * Estado devuelto:
 *   - recording: boolean indicando si se está grabando.
 *   - audioBlob: Blob con la grabación final.
 *   - audioFile: File generado a partir del Blob.
 *
 * Funciones devueltas:
 *   - startRecording(): inicia la grabación.
 *   - stopRecording(): detiene la grabación.
 *   - toggleRecording(): alterna entre iniciar y detener la grabación con beep.
 *
 * Autor: Ana Castro
└─────────────────────────────────────────────────────────────────────────────*/

import { useState, useRef } from "react";
import beepStart from "../../assets/beep_start.mp3";
import beepEnd from "../../assets/beep_end.mp3";

export function useVoiceRecorder() {
    const [recording, setRecording] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [processing, setProcessing] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const playBeep = (type) => {
        const audio = new Audio(type === "start" ? beepStart : beepEnd);
        audio.volume = 0.5;
        audio.play().catch(() => {});
    };

    const toggleRecording = async () => {
        if (recording) {
            playBeep("end");
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            setRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop());
                setProcessing(true);

                try {
                    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    const wavFile = await convertWebMToWav(blob);
                    setAudioFile(wavFile);
                } catch (err) {
                    console.error("Error al convertir audio:", err);
                } finally {
                    setProcessing(false);
                }
            };

            playBeep("start");
            setTimeout(() => {
                mediaRecorder.start();
                setRecording(true);
            }, 150);
        } catch (err) {
            console.error("❌ Error al iniciar grabación:", err);
        }
    };

    return { recording, toggleRecording, audioFile, processing };
}

async function convertWebMToWav(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const offlineCtx = new OfflineAudioContext(1, decodedBuffer.length, 16000);
    const source = offlineCtx.createBufferSource();
    source.buffer = decodedBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBuffer = encodeWAV(renderedBuffer);
    return new File([wavBuffer], "recording.wav", { type: "audio/wav" });
}

function encodeWAV(buffer) {
    const numChannels = 1;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * 2;
    const bufferArray = new ArrayBuffer(44 + length);
    const view = new DataView(bufferArray);

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, length, true);

    let offset = 44;
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
        let s = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
    }
    return view;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
