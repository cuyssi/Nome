import Button from "../commons/Button";
import { Mic, SquarePen } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { useTranscription } from "../../hooks/useTranscription";
import { useEffect } from "react";

const Voice_rec = ({ openModalWithTask }) => {
    const { recording, toggleRecording, audioFile, startRecording, stopRecording } = useVoiceRecorder();
    const { sendFile, isProcessing, confirmationMessage } = useTranscription();
    
    useEffect(() => {
        if (audioFile) {
            sendFile(audioFile);
        }
    }, [audioFile]);

    return (
        <div className="relative flex flex-col w-full h-[100%] bg-black justify-center items-center">
            <div className="flex justify-center items-center bg-gradient-to-br from-yellow-400 to-purple-600 rounded-full p-[1.8px]">
                <Button
                    className="flex bg-black border border-black rounded-full w-[50vw] max-w-[10rem] aspect-square items-center justify-center"
                    onClick={toggleRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                >
                    <Mic
                        className={`stroke-[2] w-10 h-10 ${
                            recording ? "text-green-400" : "text-purple-400"
                        } drop-shadow-[0_0px_0.5px_white]`}
                    />
                </Button>
            </div>
            
            <div className="h-6 mt-2 flex items-center justify-center">
                <p
                    className={`text-sm transition-opacity duration-500 ${
                        isProcessing ? "opacity-100 text-yellow-300 animate-pulse" : "opacity-0"
                    }`}
                    aria-live="polite"
                >
                    Espera por favor, procesando audio...
                </p>
                <p
                    className={`text-sm transition-opacity duration-500 absolute ${
                        confirmationMessage ? "opacity-100 text-green-300" : "opacity-0"
                    }`}
                    aria-live="polite"
                >
                    ✅ Tarea añadida!
                </p>
            </div>

            <div className="absolute bottom-3 right-2 z-50">
                <div className="flex justify-center items-center w-10 h-10 p-[1.8px] bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl">
                    <Button
                        onClick={() => openModalWithTask({})}
                        className="flex justify-center items-center w-full h-full border border-none rounded-xl bg-black"
                    >
                        <SquarePen className="w-5 h-5 text-white drop-shadow-[0_1px_1px_black]" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Voice_rec;
