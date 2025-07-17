import { getTranscriptionOfStorage, sortedTasks } from "../../utils/transcriptionStorage";
import { Task_card } from "./Task_card";
import { filterTasks } from "../../utils/taskFilter";

export const Tasks_list = ({ type, exclude = false }) => {
    const tasks = getTranscriptionOfStorage() || [];
    const task_list = sortedTasks(tasks);
    const filtered_tasks = type
    ? filterTasks(task_list, type, exclude)
    : task_list;    
    return (
        <div className="flex flex-col gap-10 items-center w-full h-[85%] overflow-y-auto px-2 mt-4">
            {filtered_tasks.map((task, index) => {                
                return <Task_card key={index} task={task} />;
            })}
        </div>
    );
};
