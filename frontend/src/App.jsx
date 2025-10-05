/**──────────────────────────────────────────────────────────────────────────────┐
 * Componente principal de la aplicación.                                        │
 *                                                                               │
 * Funcionalidad:                                                                │
 *   • Inicializa el deviceId si no existe.                                      │
 *   • Suscribe al usuario a notificaciones push al montar el componente.        │
 *   • Define rutas principales usando React Router:                             │
 *       - "/" → Home                                                            │
 *       - "/tasks" → Tasks                                                      │
 *       - "/dates" → Dates                                                      │
 *       - "/today" → Today_tasks                                                │
 *       - "/completed" → Completed_tasks                                        │
 *       - "/pending" → Pending_tasks                                            │
 *       - "/calendar" → Calendar_page                                           │
 *       - "/schedule" → Schedule_page                                           │
 *       - "/bags" → Bags                                                        │
 *   • Contenedor principal con estilos responsivos usando Tailwind y clsx.      │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Tasks } from "./pages/Tasks";
import { Dates } from "./pages/Dates";
import { Footer } from "./components/commons/Footer";
import { Completed_tasks } from "./pages/Completed_tasks";
import { Pending_tasks } from "./pages/Pending_tasks";
import { Today_tasks } from "./pages/Today_tasks";
import { ensureDeviceId } from "./utils/ensureDeviceId";
import { Schedule_page } from "./pages/Schedule_page";
import { Calendar_page } from "./pages/Calendar_page";
import { Bags } from "./pages/Bags";
import { HelpToggle } from "./components/tutorials/HelpToggle";
import { ButtonTheme } from "./components/commons/buttons/ButtonTheme";

import clsx from "clsx";

function App() {
    useEffect(() => {
        ensureDeviceId();
    }, []);

    return (
        <div className="flex flex-col sm:flex-row w-full h-[100dvh] sm:items-center sm:justify-center sm:bg-gray-400 border border-black">
            <div
                className={clsx(
                    "relative",
                    "w-full h-full bg-white flex flex-col",
                    "sm:max-w-[360px] sm:max-h-[720px] sm:rounded-xl sm:shadow-md sm:overflow-hidden"
                )}
            >
                <main className="bg-bg flex-1 overflow-y-auto border border-none">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/dates" element={<Dates />} />
                        <Route path="/today" element={<Today_tasks />} />
                        <Route path="/completed" element={<Completed_tasks />} />
                        <Route path="/pending" element={<Pending_tasks />} />
                        <Route path="/calendar" element={<Calendar_page />} />
                        <Route path="/schedule" element={<Schedule_page />} />
                        <Route path="/bags" element={<Bags />} />
                    </Routes>
                    <HelpToggle />
                    <ButtonTheme />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default App;
