import { Task_card } from "./Task_card";
import { useTasks } from "../../hooks/useTasks";

export const Tasks_list = ({ type, exclude = false }) => {
    const { tasks, deleteTask } = useTasks(type, exclude);
    return (
        <div className="flex flex-col gap-8 items-center w-full h-[74%] overflow-y-auto px-2 py-4 ">
            {tasks.map((task) => {
                return <Task_card key={task.id} task={task} onDelete={deleteTask} />;
            })}
        </div>
    );
};
