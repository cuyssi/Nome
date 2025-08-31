import { useState, useRef } from "react";
import beep_start from "./../assets/beep_start.mp3";
import beep_end from "./../assets/beep_end.mp3";

export const useVoiceRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioFile, setAudioFile] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const startSound = useRef(new Audio(beep_start));
    const stopSound = useRef(new Audio(beep_end));
    const audioCtx = useRef(new (window.AudioContext || window.webkitAudioContext)());

    const passToFile = (blob) => {
        if (!blob) return null;
        return new File([blob], "recording.webm", { type: "audio/webm" });
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
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
    };

    const toggleRecording = async () => {
        if (audioCtx.current.state === "suspended") {
            await audioCtx.current.resume();
        }

        if (!recording) {
            startSound.current.play().catch(() => {
                console.warn("🔈 Beep de inicio bloqueado por autoplay.");
            });
            startRecording();
        } else {
            stopSound.current.play().catch(() => {
                console.warn("🔈 Beep de fin bloqueado por autoplay.");
            });
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
