/**─────────────────────────────────────────────────────────────────────────────┐
 * useVoiceRecorder: hook para grabar audio con el micrófono del usuario.       │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Permite iniciar, detener y alternar la grabación de audio.               │
 *   • Reproduce un beep al iniciar y al finalizar la grabación.                │
 *   • Devuelve el audio como Blob y como File listo para enviar o guardar.     │
 *   • Gestiona internamente el MediaRecorder y AudioContext.                   │
 *                                                                              │
 * Estado devuelto:                                                             │
 *   - recording: boolean indicando si se está grabando.                        │
 *   - audioBlob: Blob con la grabación final.                                  │
 *   - audioFile: File generado a partir del Blob.                              │
 *                                                                              │
 * Funciones devueltas:                                                         │
 *   - startRecording(): inicia la grabación.                                   │
 *   - stopRecording(): detiene la grabación.                                   │
 *   - toggleRecording(): alterna entre iniciar y detener la grabación con beep.│
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/


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

    const passToFile = (blob) => {
        if (!blob) return null;
        return new File([blob], "recording.webm", { type: "audio/webm" });
    };

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

    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Tu navegador no permite grabar audio.");
            console.error("🎙️ getUserMedia no disponible.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioFile(passToFile(blob));
                console.log("✅ Audio listo, tamaño:", blob.size);
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
        if (!recording) {
            await playBeep(beep_start);
            startRecording();
        } else {
            await playBeep(beep_end);
            stopRecording();
        }
    };

    return {
        recording,
        audioBlob,
        audioFile,
        toggleRecording,
        startRecording,
        stopRecording,
    };
};
