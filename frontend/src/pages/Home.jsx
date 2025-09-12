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
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager"

export const Home = () => {
    const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation } = useTaskEditor();

    return (
        <div className="flex flex-col w-full h-full items-center bg-black overflow-hidden">
            <div className="flex flex-col  w-full h-full items-center bg-black">
                <Welcome />
                <Task_count />
                <Voice_rec openModalWithTask={openModalWithTask}/>
                <TaskModalManager
                    isOpen={isOpen}
                    selectedTask={selectedTask}
                    showConfirmation={showConfirmation}
                    onEdit={handleEdit}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
};

