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
        <div className="flex flex-col h-full justify-start overflow-hidden">
             <h2 className="text-purple-400 font-bold font-poppins text-3xl text-center mt-24 mb-10">{title}</h2>
            <div className="flex flex-col items-center relative border-bg w-full h-[100vh] px-2 py-4 transition-colors duration-300 bg-bg mt-[-2px]">{children}</div>
        </div>
    );
};
