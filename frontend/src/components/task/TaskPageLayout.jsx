/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente TaskPageLayout: disposición de página para secciones de tareas.   │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Renderiza un título centrado y estilizado.                               │
 *   • Envuelve el contenido de la página en un contenedor con altura/anchura.  │
 *   • Ideal para páginas de tareas como Today, Pending, Completed, etc.        │
 *                                                                              │
 * Props:                                                                       │
 *   - title: string que representa el título de la página.                     │
 *   - children: elementos hijos a renderizar dentro del layout.                │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/


export const TaskPageLayout = ({ title, children }) => {
    return (
        <div className="flex flex-col h-[100%] items-center overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-3xl mt-16 mb-12 text-center">{title}</h2>
            <div className="w-[90%] h-[90%]">{children}</div>
        </div>
    );
};
