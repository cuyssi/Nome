/**─────────────────────────────────────────────────────────────────────────────
 * Componente Voice_rec: grabador de voz con transcripción automática.
 *
 * Funcionalidad:
 *   • Botón principal con icono de micrófono: inicia/detiene la grabación.
 *   • Al finalizar la grabación, envía el audio a `useTranscription`.
 *   • Botón adicional con icono de lápiz: abre un modal vacío para crear tarea.
 *
 * Props:
 *   - openModalWithTask: función que abre el modal de edición de tarea.
 *   - showConfirmationForTask: función que muestra confirmación tras guardar.
 *
 * Hooks internos:
 *   - useVoiceRecorder: gestiona grabación de audio (start/stop/toggle).
 *   - useTranscription: procesa y convierte audio en texto.
 *
 * Autor: Ana Castro
└─────────────────────────────────────────────────────────────────────────────*/

import { Mic, SquarePen } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/audio/useVoiceRecorder";
import { useTranscription } from "../../hooks/commons/useTranscription";
import { useEffect, useState } from "react";
import { TaskSavedModal } from "../commons/modals/TaskSavedModal";

export const Voice_rec = ({ openModalWithTask, showConfirmationForTask, setModalInfo }) => {
    const { recording, toggleRecording, audioFile } = useVoiceRecorder();
    const { sendFile } = useTranscription();

    useEffect(() => {
        if (audioFile) {
            setModalInfo({ isOpen: true, isProcessing: true, task: null });

            sendFile(audioFile, {
                repeat: "once",
                customDays: [],
                onTaskSaved: (savedTask) => {
                    setModalInfo({ isOpen: true, isProcessing: false, task: savedTask });
                },
            });
        }
    }, [audioFile]);

    const closeModal = () => setModalInfo({ isOpen: false, isProcessing: false, task: null });

    return (
        <div className="relative flex flex-col w-full items-center mt-14 sm:mt-12">
            <div className="flex justify-center border-dynamic rounded-full">
                <button
                    type="button"
                    className={`flex bg-bg_button rounded-full w-[12rem] sm:max-w-[10rem] aspect-square items-center justify-center transition-transform duration-150 ease-in-out ${
                        recording ? "scale-95 bg-gray-900" : "bg-bg_button"
                    }`}
                    onClick={toggleRecording}
                >
                    <Mic
                        className={`stroke-[2] w-14 h-14 sm:w-14 sm:h-14 ${
                            recording ? "text-green-400" : "text-purple-400"
                        } drop-shadow-[0_0px_0.5px_white]`}
                    />
                </button>
            </div>

            <div className="absolute right-4 top-0 flex justify-center items-center w-10 h-10 border-dynamic rounded-xl mb-2">
                <button
                    onClick={() => openModalWithTask({})}
                    className="flex justify-center items-center w-full h-full border-none rounded-xl bg-bg"
                >
                    <SquarePen className="w-5 h-5 text-text " />
                </button>
            </div>
        </div>
    );
};

export default Voice_rec;
