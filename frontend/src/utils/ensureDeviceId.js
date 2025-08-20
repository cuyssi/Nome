import { v4 as uuidv4 } from "uuid";

export const ensureDeviceId = () => {
  const existingId = localStorage.getItem("deviceId");
  if (!existingId) {
    const newId = uuidv4();
    localStorage.setItem("deviceId", newId);
    console.log("🆕 Nuevo deviceId generado:", newId);
  } else {
    console.log("✅ deviceId ya existe:", existingId);
  }
};
