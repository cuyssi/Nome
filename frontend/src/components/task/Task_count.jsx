import Container from "../commons/Container";
import { Link } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";

import { NotebookPen, CalendarDays } from "lucide-react";

const Task_count = ({ tasks = [] }) => {
    const { todayTasks } = useTasks();
    const completedTodayCount = todayTasks.filter((t) => t.completed).length;
    const pendingTodayCount = todayTasks.filter((t) => !t.completed).length;
    const totalTodayCount = todayTasks.length;

    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="w-full">
                <div className="flex flex-col w-full">
                    <div className="flex w-full justify-between">
                        <div className="w-full pr-2 pl-4">
                            <Container className="w-[100%] py-3">
                                <Link to="./tasks" className="flex justify-center items-center gap-1 py-2">
                                    <NotebookPen className="w-7 text-white" />
                                    <p className="text-white font-poppins text-lg">Deberes</p>
                                </Link>
                            </Container>
                        </div>

                        <div className="w-full pl-2 pr-4">
                            <Container className="w-[100%] py-3">
                                <Link to="./tasks" className="flex justify-center items-center gap-1 py-2">
                                    <CalendarDays className="w-7 text-white" />
                                    <p className="text-white font-poppins text-lg">Calendario</p>
                                </Link>
                            </Container>
                        </div>
                    </div>
                </div>

                <div className="flex w-[100%] justify-center items-center px-4 mt-4">
                    <Container innerClass="flex justify-between items-center" outerClass="w-[100%]">
                        <Link to="./today" className="flex-1 flex-col p-2 no-underline justify-center items-center">
                            <p className="text-yellow-200 text-center font-extrabold drop-shadow-[0_0_1px_black] text-2xl">
                                {totalTodayCount}
                            </p>
                            <p className="text-white text-center font-poppins text-sm mt-2">Para hoy</p>
                        </Link>
                        <Link to="./pending" className="flex-1 flex-col p-2 no-underline justify-center items-center">
                            <p className="text-transparent bg-clip-text text-center bg-gradient-to-br from-yellow-400 to-purple-600 drop-shadow-[0_0_1px_black] font-extrabold text-2xl">
                                {pendingTodayCount}
                            </p>
                            <p className="text-white text-center font-poppins text-sm mt-2">Pendientes</p>
                        </Link>
                        <Link to="./completed" className="flex-1 flex-col p-2 no-underline justify-center items-center">
                            <p className="text-purple-400 font-extrabold text-center drop-shadow-[0_0_1px_black] text-2xl">
                                {completedTodayCount}
                            </p>
                            <p className="text-white text-center font-poppins text-sm mt-2">Completas</p>
                        </Link>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Task_count;
