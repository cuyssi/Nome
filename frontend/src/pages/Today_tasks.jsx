import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";

const Today_tasks = () => {
  const { todayTasks } = useTasks();
  console.log("todayTasks in today:", todayTasks);

  return (
    <div className="flex flex-col bg-black h-[100%] justify-center items-center border border-black mt-4">
            <h2 className="flex justify-center text-purple-400 font font-bold font-poppins text-3xl underline-offset-8 decoration-[3px] mt-6 mb-10">
                Tareas para Hoy
            </h2>
            <div className="w-[90%]">
                <Tasks_list tasks={todayTasks} />
            </div>
        </div>
    );
};

export default Today_tasks;
