/**─────────────────────────────────────────────────────────────────────────────
 * useVoiceRecorder: hook para grabar audio desde el micrófono.
 *
 * Funcionalidad:
 *   • Gestiona grabación de audio en navegador.
 *   • Convierte a WAV mono 16kHz compatible con APIs de reconocimiento.
 *   • Reproduce sonidos de inicio/fin de grabación al hacer click.
 *   • AudioContext se desbloquea solo al primer gesto del usuario.
 *
 * Devuelve:
 *   - recording: booleano de grabación activa.
 *   - audioBlob: Blob WAV listo para enviar.
 *   - audioFile: File WAV listo para enviar.
 *   - toggleRecording(): inicia/detiene grabación con beep.
 *   - startRecording(), stopRecording(): control manual.
 *
 * Autor: Ana Castro
└─────────────────────────────────────────────────────────────────────────────*/

import { useState, useRef } from "react";
import beep_start from "../../assets/beep_start.mp3";
import beep_end from "../../assets/beep_end.mp3";

export const useVoiceRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioCtx = useRef(new (window.AudioContext || window.webkitAudioContext)());

    const playBeep = async (url) => {
        try {
            if (audioCtx.current.state === "suspended") await audioCtx.current.resume();
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.current.decodeAudioData(arrayBuffer);
            const source = audioCtx.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.current.destination);
            source.start(0);
        } catch (err) {
            console.warn("🔈 Error al reproducir beep:", err);
        }
    };

    const floatTo16BitPCM = (float32Array) => {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < float32Array.length; i++) {
            let s = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return buffer;
    };

    const encodeWAV = (samples, sampleRate = 16000) => {
        const buffer = new ArrayBuffer(44 + samples.byteLength);
        const view = new DataView(buffer);

        const writeString = (view, offset, str) => {
            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        };

        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + samples.byteLength, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, "data");
        view.setUint32(40, samples.byteLength, true);
        new Uint8Array(buffer, 44).set(new Uint8Array(samples));

        return buffer;
    };

    const resample = (buffer, originalSampleRate, targetSampleRate) => {
        if (originalSampleRate === targetSampleRate) return buffer;
        const ratio = originalSampleRate / targetSampleRate;
        const length = Math.floor(buffer.length / ratio);
        const result = new Float32Array(length);
        for (let i = 0; i < length; i++) result[i] = buffer[Math.floor(i * ratio)];
        return result;
    };

    const webmToWav16k = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioCtx.current.decodeAudioData(arrayBuffer);

        // Forzar mono (promedia canales si es stereo)
        const channelData = audioBuffer.numberOfChannels > 1
            ? audioBuffer.getChannelData(0).map((v, i) => {
                let sum = v;
                for (let c = 1; c < audioBuffer.numberOfChannels; c++) {
                    sum += audioBuffer.getChannelData(c)[i];
                }
                return sum / audioBuffer.numberOfChannels;
            })
            : audioBuffer.getChannelData(0);

        const wavBuffer = floatTo16BitPCM(resample(channelData, audioBuffer.sampleRate, 16000));
        return new Blob([encodeWAV(wavBuffer)], { type: "audio/wav" });
    };

    const startRecording = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert("Tu navegador no permite grabar audio.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

            mediaRecorder.onstop = async () => {
                const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const wavBlob = await webmToWav16k(webmBlob);
                setAudioBlob(wavBlob);
                setAudioFile(new File([wavBlob], "recording.wav", { type: "audio/wav" }));
                console.log("✅ Audio listo para enviar, tamaño:", wavBlob.size);
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            alert("No se pudo acceder al micrófono. Revisa los permisos.");
            console.error("🎙️ Error al iniciar la grabación:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const toggleRecording = async () => {
        if (audioCtx.current.state === "suspended") await audioCtx.current.resume();

        if (!recording) {
            await playBeep(beep_start);
            startRecording();
        } else {
            await playBeep(beep_end);
            stopRecording();
        }
    };

    return { recording, audioBlob, audioFile, toggleRecording, startRecording, stopRecording };
};
