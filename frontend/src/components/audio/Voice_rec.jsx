import Button from "../commons/Button";
import { Mic, SquarePen } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { useTranscription } from "../../hooks/useTranscription";
import { useEffect } from "react";

const Voice_rec = () => {
    const { recording, toggleRecording, audioFile, startRecording, stopRecording } = useVoiceRecorder();
    const { sendFile, isProcessing, confirmationMessage } = useTranscription();

    useEffect(() => {
        if (audioFile) {
            sendFile(audioFile);
        }
    }, [audioFile]);

    return (
        <div className="flex flex-col w-full h-auto p-3 bg-black justify-center items-center mt-14">
            <div className="flex justify-center border border-none items-center bg-gradient-to-br from-yellow-400 to-purple-600 rounded-full p-[1.8px]">
                <Button
                    className="flex bg-black border border-black rounded-[100%] w-[8rem] h-[8rem] items-center justify-center"
                    onClick={toggleRecording}
                    onTouchStart={startRecording} 
                    onTouchEnd={stopRecording}
                >
                    {" "}
                    <Mic
                        className={`stroke-[2] w-10 h-10 ${
                            recording ? "text-green-400" : "text-purple-400"
                        } drop-shadow-[0_0px_0.5px_white]`}
                    />
                </Button>
            </div>
            <div className="flex justify-center items-center w-8 h-8 p-[1.8px] mx-auto bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl mr-0 mt-6">
                <Button className="flex justify-center items-center w-full h-full border border-none rounded-xl bg-black">
                    <SquarePen className="w-5 h-5 text-white border border-black drop-shadow-[0_1px_1px_black]" />
                </Button>
            </div>
            {isProcessing && <p className="text-sm text-yellow-300 mt-2 animate-pulse">Espera por favor, procesando audio...</p>}
            {confirmationMessage && (
  <p className="text-sm text-green-300 mt-2 transition-opacity duration-500">✅ Tarea añadida!</p>
)}
        </div>
    );
};

export default Voice_rec;
