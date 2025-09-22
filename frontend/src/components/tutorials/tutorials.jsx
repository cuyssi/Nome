/**──────────────────────────────────────────────────────────────────────────────┐
 * Archivo tutorials.jsx: define los pasos de los tutoriales de la app.          │
 *                                                                               │
 * Funcionalidad:                                                                │
 *   • Contiene los pasos de tutorial para distintas secciones: Mochilas,        │
 *     Calendario, Fechas, Inicio, Horario y Tareas.                             │
 *   • Cada paso incluye título, contenido (JSX) y posición del modal.           │
 *   • Permite mostrar tutoriales contextuales según la sección y pestaña.       │
 *                                                                               │
 * Estructura de datos:                                                          │
 *   - stepsBags, stepsCalendar, stepsDates, stepsHome, stepsSchedule, stepsTasks│
 *   - Cada array/objeto tiene:                                                  │
 *       • title: string → título del paso.                                      │
 *       • content: JSX → contenido mostrado en el modal.                        │
 *       • position: {top, left} → posición en pantalla del modal.               │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

import {
    Backpack,
    Plus,
    Pencil,
    Repeat,
    Bell,
    Mic,
    SquarePen,
    Notebook,
    NotebookPen,
    Trash,
    Check,
} from "lucide-react";

export const stepsBags = {
    mochilas: [
        {
            title: "Mochilas",
            content: (
                <p>En esta sección puedes crear mochilas personalizadas para organizar lo que necesitas preparar...</p>
            ),
            position: { top: "50%", left: "50%" },
            highlight: {
                position: {
                    top: "8%",
                    left: "15%",
                    transform: "translate(-50%, -100%) rotate(130deg)",
                },
            },
        },
    ],
    escolar: [
        {
            title: "Mochila escolar",
            content: (
                <p>Se genera automáticamente cada día con tus asignaturas del día siguiente...Cuando termines el tutorial, edítala
                y fija la hora a la que quieres que te llegue la notificación.</p>
            ),
            position: { top: "50%", left: "50%" },
            highlight: {
                position: {
                    top: "15%",
                    left: "15%",
                    transform: "translate(-50%, -100%) rotate(150deg)",
                },
            },
        },
    ],
    crear: [
        {
            title: "Crea tu mochila",
            content: (
                <p>
                    Pulsa <span className="font-bold text-purple-400">“Crear mochila”</span> para crear mochilas
                    nuevas...
                </p>
            ),
            position: { top: "50%", left: "50%" },
            highlight: {
                position: {
                    top: "85%",
                    left: "50%",
                    transform: "translate(-50%, -100%) rotate(180deg)",
                },
            },
        },
    ],
    personalizar: [
        {
            title: "Personaliza tus mochilas",
            content: <p>Desliza una mochila a la izquierda para editarla...</p>,
            position: { top: "50%", left: "50%" },
            highlight: {
                position: {
                    top: "26%",
                    left: "60%",
                    transform: "translate(-50%, -100%) rotate(270deg)",
                },
                animationClass: "animate-bounceStrong",
            },
        },
    ],
    consultar: [
        {
            title: "Consulta y marca tareas",
            content: <p>Pulsa una mochila para abrirla. Verás los elementos que contiene...</p>,
            position: { top: "50%", left: "50%" },
            highlight: {
                position: {
                    top: "15%",
                    left: "15%",
                    transform: "translate(-50%, -100%) rotate(150deg)",
                },
            },
        },
    ],
    eliminar: [
        {
            title: "Elimina mochilas",
            content: (
                <div>
                    <p>Si ya no necesitas una mochila, deslízala a la derecha para borrarla...</p>
                    <p className="font-bold text-red-400 text-xs mt-2">*La mochila escolar no se puede eliminar</p>
                </div>
            ),
            position: { top: "50%", left: "50%" },
            highlight: {
                position: {
                    top: "25%",
                    left: "40%",
                    transform: "translate(-20%, -90%) rotate(90deg)",
                },
                animationClass: "animate-bounceStrong",
            },
        },
    ],
};

export const stepsCalendar = [
    {
        title: "Tu calendario",
        content: (
            <div>
                <p>
                    Aquí puedes ver tus tareas organizadas por día. Los puntos de color verde o rojo indican si todas las
                    tareas están completadas.
                </p>
                <p className="text-red-400 text-xs mt-2">
                    * Si aún no tienes ninguna tarea creada no verás ningún punto.
                </p>
            </div>
        ),
        position: { top: "35%", left: "50%" },
    },
    {
        title: "Consulta tus tareas",
        content: (
            <div>
                <p>
                    Pincha en el día en donde creaste la tarea anteriormente. Se abrirá un panel donde puedes ver la tarea y
                    editarla.
                </p>
                <p className="text-red-400 text-xs mt-2">
                    * Si no puedes ver el día con la tarea puedes mover esta ventana deslizandola con el dedo.
                </p>
            </div>
        ),
        position: { top: "35%", left: "50%" },
    },
    {
        title: "Marca como completada",
        content: (
            <p>
                El punto del calendario se volverá verde si todas
                están completas.
            </p>
        ),
        position: { top: "50%", left: "50%" },
    },
    {
        title: "Repeticiones inteligentes",
        content: (
            <p>
                Las tareas pueden repetirse:
                <span className="italic text-purple-400"> diariamente, entre semana o en días personalizados.</span> Nome las mostrará
                automáticamente según tu configuración.
            </p>
        ),
        position: { top: "50%", left: "50%" },
    },
];

export const stepsDates = {
    citas: [
        {
            title: "Citas personales",
            content: (
                <div className="text-justify">
                    Aquí se mostrarán todas tus citas que contengan expresiones como{" "}
                    <span className="italic text-purple-600">“quedé”, “me veré con”, “tengo una cita con”</span>.
                    <div className="italic text-gray-400 text-sm mt-4">
                        Ej. Mañana quedé con Marcos a las cinco y media de la tarde en la plaza.
                    </div>
                </div>
            ),
            position: { top: "50%", left: "50%" },
        },
        {
            title: "Cómo gestionar tus citas",
            content: (
                <div className="text-justify">
                    Desliza hacia la izquierda para <span className="text-orange-400">editar</span>, hacia la derecha
                    para <span className="text-red-600">eliminar</span>. Mantén pulsado para marcar como{" "}
                    <span className="text-green-400">completada</span>.
                    <div className="mt-4">
                        Al editar, puedes cambiar el color, la fecha, la hora, configurar repeticiones o ajustar la
                        notificación.
                    </div>
                </div>
            ),
            position: { top: "50%", left: "50%" },
        },
    ],
    medico: [
        {
            title: "Citas médicas",
            content: (
                <div className="text-justify">
                    Aquí se mostrarán tus tareas que contengan la palabra{" "}
                    <span className="italic text-purple-600">“médico”</span>.
                    <div className="italic text-gray-400 text-sm mt-4">
                        Ej. Tengo cita con el médico el día 24 a las ocho y media de la mañana.
                    </div>
                </div>
            ),
            position: { top: "50%", left: "50%" },
        },
    ],
    otros: [
        {
            title: "Otros",
            content: (
                <div className="text-justify">
                    Aquí se agrupan tareas que no encajan en ninguna categoría específica.
                    <div className="italic text-gray-400 text-sm mt-4">Ej. Comprar bolígrafos de punta fina.</div>
                </div>
            ),
            position: { top: "50%", left: "50%" },
        },
    ],
};

export const stepsHome = [
    {
        title: "¡Bienvenido a Nome!",
        content: (
            <>
                <p>
                    Esta es tu pantalla principal. Aquí verás tus tareas, podrás grabar nuevas y acceder a todo lo
                    importante.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Bell className="w-6 h-6 text-green-600" />
                    <span>Si no lo está ya, activa las notificaciones pulsando en el icono.</span>
                </div>
                <p className="text-red-400 text-xs mt-4">
                    * Si en algún momento te molesta esta ventana puedes moverla arrastrandola a donde quieras 😉
                </p>
            </>
        ),
        position: { top: "50%", left: "50%" },
        highlight: {
            selector: "#bell-toggle",
            position: { top: "15%", left: "84%" },
        },
    },
    {
        title: "Vamos a probar algo",
        content: (
            <>
                <p>
                    Pulsa el botón morado <Mic className="inline w-6 h-6 text-purple-600" /> y di:
                    <span className="italic text-red-400"> "Quedé con Marcos en las canchas a las 9"</span>. Luego,
                    vuelve a presionarlo para parar la grabación.
                </p>

                <p className="w-full mt-4 text-xs text-red-400">
                    También puedes añadir tareas a mano tocando el icono del lápiz{" "}
                    <SquarePen className="inline w-4 h-4 text-blue-600" />
                </p>
            </>
        ),
        position: { top: "32%", left: "50%" },
        highlight: {
            selector: "#bell-toggle",
            position: {
                top: "68%",
                left: "84%",
                transform: "translate(-50%, -100%) rotate(230deg)",
            },
        },
    },
    {
        title: "¡Perfecto!",
        content: (
            <p>
                Ahora podrás ver tus citas en <Notebook className="inline w-4 h-4 text-purple-600" /> (abajo a la
                izquierda), pero espera no vaya ahí todavía, continuemos...pulsa en siguiente
            </p>
        ),
        position: { top: "61%", left: "50%" },
        highlight: {
            selector: "#notebook",
            position: {
                top: "93%",
                left: "8%",
                transform: "translate(-50%, -100%) rotate(180deg)",
            },
        },
    },
    {
        title: "Organiza tus deberes",
        content: (
            <p>
                En el botón <NotebookPen className="inline text-purple-400" />
                "Deberes" puedes añadir tareas como “deberes”, "trabajo" o "examen". Aquí va todo lo relacionado con los
                trabajos escolares.
            </p>
        ),
        position: { top: "63%", left: "50%" },
        highlight: {
            position: {
                top: "48%",
                left: "28%",
                transform: "translate(-50%, -100%) rotate(0deg)",
            },
        },
    },
    {
        title: "Horario",
        content: (
            <p>
                Aquí podrás meter tu horario de clase. La app lo consulta para avisarte con una notificación de lo que
                tienes que meter en la mochila <Backpack className="inline text-purple-600" /> para el día siguiente.
            </p>
        ),
        position: { top: "64%", left: "50%" },
        highlight: {
            position: {
                top: "48%",
                left: "75%",
                transform: "translate(-50%, -100%) rotate(0deg)",
            },
        },
    },
    {
        title: "Tareas para hoy",
        content: (
            <p className="text-sm">
                Aquí podrás ver las tareas que tienes para hoy, cuáles están pendientes y cuáles completadas. Puedes
                pinchar en cada categoría para verlas.
            </p>
        ),
        position: { top: "78%", left: "50%" },
        highlight: {
            position: {
                top: "45%",
                left: "10%",
                transform: "translate(-50%, -100%) rotate(130deg)",
            },
        },
    },
];

export const stepsSchedule = [
    {
        title: "Tu horario escolar",
        content: (
            <p>
                Aquí puedes configurar tus clases por día y hora. Así Nome sabrá qué asignaturas tienes cada jornada.
                Añade tu horario de clase.
            </p>
        ),
        position: { top: "40%", left: "50%" },
    },
    {
        title: "Añadir horas",
        content: (
            <div>
                <p>
                    Usa el botón <span className="font-bold text-purple-400">“➕ Add hour”</span> para definir los
                    bloques que necesitas.
                </p>
                <div className="mt-4 flex items-center gap-2 justify-center text-sm text-gray-600">
                    <Plus className="w-5 h-5 text-purple-400" />
                    <span>Ejemplo: 08:30, 10:15, etc.</span>
                </div>
            </div>
        ),
        position: { top: "55%", left: "50%" },
    },
    {
        title: "Asignar asignaturas",
        content: (
            <p>
                Haz clic en una celda para asignar una asignatura. Puedes elegir el nombre y el color para identificarla
                fácilmente.
            </p>
        ),
        position: { top: "65%", left: "50%" },
    },
    {
        title: "Editar o eliminar",
        content: (
            <p>
                Pulsa sobre una asignatura para editarla. También puedes eliminar horas con el botón “➖ Remove hour”.
            </p>
        ),
        position: { top: "50%", left: "50%" },
    },
    {
        title: "Tu mochila se prepara sola",
        content: (
            <div>
                <p>
                    Nome consulta tu horario para preparar automáticamente la mochila escolar del día siguiente. ¡Así no
                    se te olvida nada!
                </p>
                <div className="mt-4 flex items-center gap-2 justify-center text-sm text-gray-600">
                    <Backpack className="w-5 h-5 text-purple-500" />
                    <span>Funciona con la sección Mochilas</span>
                </div>
            </div>
        ),
        position: { top: "45%", left: "50%" },
    },
];

export const stepsTasks = {
    deberes: [
        {
            title: "Deberes",
            content: (
                <p>
                    Aquí se mostrarán todas tus tareas que contengan la palabra{" "}
                    <span className="italic text-purple-600">“deberes”</span>...
                    <br></br>
                    <br></br>
                    <span className="italic text-gray-400 mt-2">Ej. Deberes de matemáticas pag.143, ej: 2, 3 y 5.</span>
                </p>
            ),
            position: { top: "55%", left: "50%" },
        },
    ],
    trabajo: [
        {
            title: "Trabajos",
            content: (
                <p>
                    Aquí se mostrarán todas tus tareas que contengan la palabra{" "}
                    <span className="italic text-purple-600">"trabajo"</span>.<br></br>
                    <br></br>
                    <span className="italic text-gray-400 mt-2">Ej. Trabajo de ciencias sobre el sistema solar.</span>
                </p>
            ),
            position: { top: "55%", left: "50%" },
        },
    ],
    examenes: [
        {
            title: "Exámenes",
            content: (
                <p>
                    Aquí se agrupan tareas que contengan la palabra{" "}
                    <span className="italic text-purple-600">"examen"</span>.<br></br>
                    <br></br>
                    <span className="italic text-gray-400 mt-2">Ej: Examen de historia el 24 de Octubre.</span>
                </p>
            ),
            position: { top: "55%", left: "50%" },
        },
    ],
};

export const stepsSettings = [
    {
        title: "Notificaciones push",
        content: (
            <div className="text-sm text-justify">
                Nome puede enviarte recordatorios aunque no tengas la app abierta. Para activarlas:
                <ul className="list-disc ml-4 mt-2">
                    <li>Pulsa la campanita arriba a la derecha</li>
                    <li>Acepta el permiso de notificación si el navegador lo solicita</li>
                    <li>
                        Puedes configurar la hora a la que quieres que te llegue el aviso editando la tarea o mochila.
                    </li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-gray-600">
                    <Bell className="w-5 h-5 text-green-500" />
                    <span>Si la campanita está verde, ¡todo está listo!</span>
                </div>
            </div>
        ),
        position: { top: "50%", left: "50%" },
    },
];
