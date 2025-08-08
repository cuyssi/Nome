import { useState, useRef } from "react";
import beep_start from "./../assets/beep_start.mp3";
import beep_end from "./../assets/beep_end.mp3";

export const useVoiceRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioFile, setAudioFile] = useState();

    const startSound = useRef(new Audio(beep_start));
    const stopSound = useRef(new Audio(beep_end));

    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("🎙️ getUserMedia no está disponible en este navegador.");
            alert("Tu navegador no permite grabar audio.");
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

            mediaRecorder.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                console.log("✅ Audio listo, tamaño:", blob.size);
                const file = passToFile(blob);
                setAudioFile(file);
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("🎙️ Error al iniciar la grabación:", err);
            alert("No se pudo acceder al micrófono. Revisa los permisos.");
        }
    };

    const passToFile = (audioBlob) => {
        if (!audioBlob) return;

        const audioFile = new File([audioBlob], "recording.webm", {
            type: "audio/webm",
        });
        return audioFile;
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const toggleRecording = () => {
        if (!recording) {
            startSound.current.play();
            startRecording();
        } else {
            stopSound.current.play();
            stopRecording();
        }
    };

    return {
        recording,
        audioBlob,
        toggleRecording,
        audioFile,
        startRecording,
        stopRecording,
    };
};
