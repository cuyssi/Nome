import Button from "../commons/Button";
import { Mic, SquarePen } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { useTranscription } from "../../hooks/useTranscription";
import { useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useTaskEditor } from "../../hooks/useTaskEditor";

const Voice_rec = () => {
    const { recording, toggleRecording, audioFile, startRecording, stopRecording } = useVoiceRecorder();
    const { sendFile, isProcessing, confirmationMessage } = useTranscription();
    const { reload, updateTask } = useTasks();
    const { openModalWithTask } = useTaskEditor(reload, updateTask);

    useEffect(() => {
        if (audioFile) {
            sendFile(audioFile);
        }
    }, [audioFile]);

    return (
        <div className="relative flex flex-col w-full h-[100%] bg-black justify-center items-center">
    {/* Botón del micrófono */}
    <div className="flex justify-center items-center bg-gradient-to-br from-yellow-400 to-purple-600 rounded-full p-[1.8px] mb-8">
        <Button
            className="flex bg-black border border-black rounded-full w-[50vw] max-w-[11rem] aspect-square items-center justify-center"
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

    {/* Mensajes visuales */}
    {isProcessing && (
        <p className="text-sm text-yellow-300 animate-pulse mt-2">
            Espera por favor, procesando audio...
        </p>
    )}
    {confirmationMessage && (
        <p className="text-sm text-green-300 mt-2 transition-opacity duration-500">
            ✅ Tarea añadida!
        </p>
    )}

    {/* Botón flotante ajustado al contenedor */}
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
