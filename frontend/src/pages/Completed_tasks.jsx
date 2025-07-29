import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";

const Completed_tasks = () => {
    const { todayTasks } = useTasks();
    const completedTasks = todayTasks.filter((task) => task.completed);

    return (
         <div className="flex flex-col bg-black h-[100%] justify-center items-center border border-black mt-4">
            <h2 className="flex justify-center text-purple-400 font font-bold font-poppins text-3xl underline-offset-8 decoration-[3px] mt-6 mb-10">
                Tareas Completas
            </h2>
            <div className="w-[90%]">
                <Tasks_list tasks={completedTasks} />
            </div>
        </div>
    );
};

export default Completed_tasks;
