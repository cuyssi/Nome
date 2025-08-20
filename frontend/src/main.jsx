/**─────────────────────────────────────────────────────────────────────────────┐
 * Punto de entrada principal para renderizar la aplicación React.              │
 * Envuelve el componente `App` con `StrictMode` para detectar problemas comunes│
 * y `BrowserRouter` para habilitar navegación con rutas basadas en URL.        │
 * Aplica estilos globales desde `index.css` y monta el DOM en #root.           │
 * Ideal como bootstrap de toda la lógica de vista y navegación del proyecto.   │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(registration => {
        console.log("✅ Service Worker registrado:", registration);
      })
      .catch(error => {
        console.error("❌ Error al registrar el Service Worker:", error);
      });
  });
}

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
   </StrictMode>
)
