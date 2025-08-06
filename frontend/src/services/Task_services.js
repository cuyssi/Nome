/**─────────────────────────────────────────────────────────────────────────────────┐
 * Función para enviar un archivo de audio al backend vía POST.                     │
 * Crea un `FormData` con el archivo `.webm` y lo envía a la API de transcripción   │
 * Usa axios para gestionar la solicitud con cabecera `multipart/form-data`.        │
 * Devuelve la respuesta procesada del servidor con la transcripción.               │
 * Ideal para hooks como `useTranscription` que automatizan el flujo de voz a texto.│
 *                                                                                  │
 * @author: Ana Castro                                                              │
 └─────────────────────────────────────────────────────────────────────────────────*/

import axios from "axios";

console.log("🌍 ENV:", import.meta.env);

const API_URL = `${import.meta.env.VITE_API_URL}/transcribe/`;
console.log("📡 API_URL:", API_URL);

export const sendAudioFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(API_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
