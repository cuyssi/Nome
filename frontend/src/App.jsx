/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente raíz que define las rutas principales de la aplicación.           │
 * Usa React Router para gestionar la navegación entre vistas (`Home`, etc).    │
 * Incluye un `Footer` fijo y estructura adaptable para vista móvil o desktop.  │
 * Rutas adicionales están comentadas y listas para ser activadas en el futuro. │
 * Ideal como entrada principal para la UI y distribución global de contenido.  │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Dates from "./pages/Dates";
// import Schedule from "./pages/Schedule"
// import Bags from "./pages/Bags"
import { Footer } from "./components/commons/Footer";
import Completed_tasks from "./pages/Completed_tasks"
import Pending_tasks from "./pages/Pending_tasks"
import Today_tasks from "./pages/Today_tasks"

function App() {
    return (
        <div className="flex bg-black flex-col sm:flex-col w-[100%] min-h-screen sm:items-center sm:justify-center">
            <main className="bg-black flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tasks" element={<Task />} />
                    <Route path="/dates" element={<Dates />} />
                    <Route path="/today" element={<Today_tasks />} />
                    <Route path="/completed" element={<Completed_tasks />} />
                    <Route path="/pending" element={<Pending_tasks />} />
                    //{" "}
                    {/* <Route path="/schedule" element={<Schedule />} />
    //   <Route path="/bags" element={<Bags />} />
   
    
    //    */}
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
