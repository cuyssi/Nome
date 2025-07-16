import { useState, useRef } from "react";

export const useVoiceRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioFile, setAudioFile] = useState();

    const startRecording = async () => {
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
            setAudioFile(file)
        };

        mediaRecorder.start();
        setRecording(true);
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
        recording ? stopRecording() : startRecording();
    };

    return {
        recording,
        audioBlob,
        toggleRecording,
        audioFile
    };
};
