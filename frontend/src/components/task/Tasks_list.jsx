import { getTranscriptionOfStorage, sortedTasks, deleteTranscriptionById } from "../../utils/transcriptionStorage";
import { Task_card } from "./Task_card";
import { filterTasks } from "../../utils/taskFilter";
import { useState, useEffect } from "react";

export const Tasks_list = ({ type, exclude = false }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const stored = getTranscriptionOfStorage() || [];
        const sorted = sortedTasks(stored);
        const filtered = type ? filterTasks(sorted, type, exclude) : sorted;
        setTasks(filtered);
    }, [type, exclude]);

    const handleDelete = (id) => {
        console.log("🧹 Eliminando tarea:", id);
        deleteTranscriptionById(id);

        const stored = getTranscriptionOfStorage();
        const sorted = sortedTasks(stored);
        const filtered = type ? filterTasks(sorted, type, exclude) : sorted;
        setTasks(filtered);
    };
    return (
        <div className="flex flex-col gap-10 items-center w-full h-[85%] overflow-y-auto px-2 mt-4">
            {tasks.map((task) => {
                return <Task_card key={task.id} task={task} onDelete={handleDelete} />;
            })}
        </div>
    );
};
