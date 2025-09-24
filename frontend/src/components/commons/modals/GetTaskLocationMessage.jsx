/**─────────────────────────────────────────────────────────────────────────────┐
 * Función GetTaskLocationMessage: genera un mensaje indicando la sección y la
 * subcategoría donde se ha guardado la tarea, junto con fecha y hora si existen.
 * 
 * Funcionalidad:
 *   • Determina la sección y subcategoría según task.type.
 *   • Para tareas de tipo "cita" o "médicos" → Agenda.
 *   • Para tareas de tipo "deberes", "trabajo" o "examen" → Escuela.
 *   • Si task.dateFull y task.hour existen, muestra la fecha y hora de la tarea.
 *   • Devuelve un fragmento JSX listo para renderizar.
 * 
 * Props:
 *   - task: objeto de la tarea que puede contener:
 *       • type: tipo de tarea ("cita", "médicos", "deberes", etc.)
 *       • dateFull: fecha completa de la tarea
 *       • hour: hora de la tarea
 * 
 * Devuelve:
 *   • Fragmento JSX con la sección, subcategoría y opcionalmente fecha y hora.
 * 
 * Autor: Ana Castro
└──────────────────────────────────────────────────────────────────────────────*/

export const GetTaskLocationMessage = (task) => {
    console.log("ESTOY EN GET TASK LOCATION MESSAGE");
    console.log("task.type:", task?.type);
    if (!task || !task.type) return <>tu lista de tareas</>;

    let seccion, subcategoria;

    switch (task.type) {
        case "cita":
            seccion = "Agenda";
            subcategoria = "Citas";
            break;
        case "médicos":
        case "medicos":
            seccion = "Agenda";
            subcategoria = "Médicos";
            break;
        case "otros":
            seccion = "Agenda";
            subcategoria = "Otros";
            break;

        case "deberes":
            seccion = "Escuela";
            subcategoria = "Deberes";
            break;
        case "trabajo":
            seccion = "Escuela";
            subcategoria = "Trabajos";
            break;
        case "examen":
            seccion = "Escuela";
            subcategoria = "Exámenes";
            break;

        default:
            return <>tu lista de tareas</>;
    }

    const dateText =
        task.dateFull && task.hour ? (
            <>
                {" "}
                <p className="text-gray-600 semibold mt-2">Para el:</p>
                <p className="font-medium text-gray-400">{task.dateFull}</p>
                <p className="text-gray-600 semibold mt-2">A las:</p>
                <p className="font-medium text-gray-400">{task.hour}</p>
            </>
        ) : null;

    console.log(
        "que imprime GETTASKLOCATIONMESSAGE seccion:",
        seccion,
        "subcategoria:",
        subcategoria,
        "dateText:",
        dateText
    );

    return (
        <>
            <span className="font-semibold text-gray-400">{seccion}</span> →{" "}
            <span className="text-gray-400 font-semibold">{subcategoria}</span>
            {dateText && <span className="text-gray-500">{dateText}</span>}
        </>
    );
};
