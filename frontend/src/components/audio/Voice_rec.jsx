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
import { useEffect } from "react";

const Voice_rec = ({ openModalWithTask, showConfirmationForTask }) => {
    const { recording, toggleRecording, audioFile } = useVoiceRecorder();
    const { sendFile, isProcessing } = useTranscription(openModalWithTask);

    useEffect(() => {
        if (audioFile) {
            sendFile(audioFile, {
                repeat: "once",
                customDays: [],
                onTaskSaved: showConfirmationForTask,                
            });
        }
    }, [audioFile]);
    

    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="relative flex flex-col w-full bg-black items-center mt-10 sm:mt-8">
                <div className="flex justify-center bg-gradient-to-br from-yellow-400 to-purple-600 rounded-full p-[1.8px]">
                    <button
                        type="button"
                        className="flex bg-black border border-black rounded-full w-[10rem] sm:max-w-[10rem] aspect-square items-center justify-center"
                        onClick={toggleRecording}
                    >
                        <Mic
                            className={`stroke-[2] w-14 h-14 sm:w-14 sm:h-14 ${
                                recording ? "text-green-400" : "text-purple-400"
                            } drop-shadow-[0_0px_0.5px_white]`}
                        />
                    </button>
                </div>
                <div className="relative w-full flex justify-end items-center px-4 mt-4">
                    <p
                        className={`text-sm transition-opacity duration-500 ${
                            isProcessing ? "opacity-100 text-yellow-300 animate-pulse" : "opacity-0"
                        }`}
                        aria-live="polite"
                    >
                        Espera por favor, procesando audio...
                    </p>

                    <div className="ml-4">
                        <div className="flex justify-center items-center w-10 h-10 sm:w-8 sm:h-8 p-[1.8px] bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl  mb-2">
                            <button
                                onClick={() => openModalWithTask({})}
                                className="flex justify-center items-center w-full h-full border border-none rounded-xl bg-black"
                            >
                                <SquarePen className="w-5 h-5 text-white drop-shadow-[0_1px_1px_black]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Voice_rec;
