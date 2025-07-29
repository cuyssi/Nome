/**─────────────────────────────────────────────────────────────────────────────┐
 * Página principal de inicio que muestra bienvenida, tareas y grabador de voz. │
 * Incluye los componentes `Welcome`, `Task_count` y `Voice_rec` en disposición │
 * vertical, ideal para dispositivos móviles o vistas centradas.                │
 * Fondo negro para resaltar los elementos con estilo moderno.                  │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import Welcome from "../components/commons/Wellcome";
import Voice_rec from "../components/audio/Voice_rec";
import Task_count from "../components/task/Task_count";

const Home = () => {
    return (
        <div className="flex flex-col w-[100%] h-[100dvh] items-center bg-black">
            <div className="flex flex-col w-[95%] h-[100dvh] items-center bg-black">
                <Welcome />
                <Task_count className="h-20" />
                <Voice_rec />
            </div>
        </div>
    );
};

export default Home;
