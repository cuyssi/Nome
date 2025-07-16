import { getTaskColor } from "../../utils/getTaskColor";
import Container_task from "../commons/Container_task";

export const Task_card = ({ task }) => {
    const color = getTaskColor(task.type);

    return (
        <Container_task outerClass={`${color.bg}`} innerClass={`${color.border}`}>
            
                {task.date || task.time ? (
                    <div className="flex flex-1 flex-col border border-black border-r-gray-900 rounded-l-xl h-full w-full px-3 gap-1 justify-center text-center">
                        <p className="text-gray-400 font-semibold text-3xl">{task.date}</p>
                        <p className="text-gray-400 font-bold text-xl">{task.hour}</p>
                    </div>
                ) : null}
                <div className="flex flex-2 text-center justify-center items-center px-2 h-full w-full text-sm text-white">
                    {["deberes", "ejercicios", "trabajo"].includes(task.type)
                        ? (task.text_raw || task.text)
                        : task.text}
                </div>            
        </Container_task>
    );
};
