/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Voice_rec: grabador de voz con transcripción automática.          │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Botón principal con icono de micrófono: inicia/detiene la grabación.     │
 *   • Al finalizar la grabación, envía el audio a `useTranscription`.          │
 *   • Muestra un aviso animado cuando se está procesando la transcripción.     │
 *   • Botón adicional con icono de lápiz: abre un modal vacío para crear tarea.│
 *   • Muestra confirmación tras guardar una tarea.                             │
 *                                                                              │
 * Props:                                                                       │
 *   - openModalWithTask: función que abre el modal de edición de tarea.        │
 *   - showConfirmationForTask: función que muestra confirmación tras guardar.  │
 *                                                                              │
 * Hooks internos:                                                              │
 *   - useVoiceRecorder: gestiona grabación de audio (start/stop/toggle).       │
 *   - useTranscription: procesa y convierte audio en texto.                    │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Mic, SquarePen } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/audio/useVoiceRecorder";
import { useTranscription } from "../../hooks/commons/useTranscription";
import { useEffect, useState } from "react";

export const Voice_rec = ({ openModalWithTask, showConfirmationForTask }) => {
    const { recording, toggleRecording, audioFile } = useVoiceRecorder();
    const { sendFile } = useTranscription();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (audioFile) {
            setIsProcessing(true);
            openModalWithTask();
            sendFile(audioFile, {
                repeat: "once",
                customDays: [],
                onTaskSaved: () => {
                    setIsProcessing(false);
                    showConfirmationForTask();
                },
            });
        }
    }, [audioFile]);

    return (
        <div className="relative flex w-full h-full justify-center items-center">
            <div className="flex justify-center border-dynamic rounded-full p-[3px] mb-4">
                <button
                    type="button"
                    className="flex bg-bg_button border-none rounded-full w-[10rem] aspect-square items-center justify-center"
                    onClick={toggleRecording}
                >
                    <Mic
                        className={`stroke-[2] w-14 h-14 ${
                            recording ? "text-green-400" : "text-purple-400"
                        } drop-shadow-[0_0px_0.5px_white]`}
                    />
                </button>

                <div className="absolute top-4 right-4 flex justify-center items-center w-10 h-10 p-[1.8px] border-dynamic rounded-xl">
                    <button
                        onClick={() => openModalWithTask(null)}
                        className="flex justify-center items-center w-full h-full border-none rounded-xl bg-bg_button"
                    >
                        <SquarePen className="w-5 h-5 text-dynamic" />
                    </button>
                </div>
            </div>

            {isProcessing && (
                <div className="absolute top-24 flex flex-col items-center justify-center p-4 bg-black/50 rounded-xl">
                    <p className="text-yellow-400 animate-pulse text-lg font-semibold">
                        Procesando audio, espera por favor...
                    </p>
                </div>
            )}
        </div>
    );
};
