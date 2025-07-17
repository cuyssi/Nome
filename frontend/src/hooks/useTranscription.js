import { sendAudioFile} from "../services/Task_services"
import {  getFormattedTasks, dateAndTime, addToTranscriptionStorage } from "../utils/transcriptionStorage"
import { getTaskColor } from "../utils/getTaskColor"
import { normalizeType } from "../utils/normalizeType"

export const useTranscription = () => {

    const sendFile = async(file) => {        
        
        try {
            const response = await sendAudioFile(file);
            console.log("📝 Transcripción recibida:", response);
            const {text_raw, text, dateTime} = getFormattedTasks(response);
            const { date, hour } = dateAndTime(dateTime)
            const text_clean = normalizeType(text)
            const { type } = getTaskColor(text_clean)   
            console.log(text_raw)         
            console.log(text)
            console.log(text_clean)
            console.log(type)            
            addToTranscriptionStorage({id: crypto.randomUUID(), text_raw, text, date, hour, type})
        } catch (err) {
            console.error("❌ Error al enviar:", err);
        }
    }
    return { sendFile };
}