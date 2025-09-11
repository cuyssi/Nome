import Container from "../commons/Container";
import { Link } from "react-router-dom";
import { NotebookPen, CalendarDays } from "lucide-react";
import { useStorageStore, isTaskActiveOnDate } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/toLocalYMD";

const Task_count = () => {
    const { tasks, isTaskCompletedForDate } = useStorageStore();
    const todayYMD = toLocalYMD(new Date());
    const todayTasks = tasks.filter((t) => isTaskActiveOnDate(t, todayYMD));
    const completedTodayCount = todayTasks.filter((t) => isTaskCompletedForDate(t.id, todayYMD)).length;
    const pendingTodayCount = todayTasks.length - completedTodayCount;
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
                                <Link to="./schedule" className="flex justify-center items-center gap-1 py-2">
                                    <CalendarDays className="w-7 text-white" />
                                    <p className="text-white font-poppins text-lg">Horario</p>
                                </Link>
                            </Container>
                        </div>
                    </div>
                </div>

                <div className="flex w-[100%] justify-center items-center px-4 mt-4">
                    <Container innerClass="flex flex-col" outerClass="w-[100%]">
                        <h3 className="text-yellow-600 font-poppins text-lg mb-4">Tareas para hoy</h3>
                        <div className="w-full flex justify-between items-center">
                            <Link to="./today" className="flex-1 flex-col no-underline justify-center items-center">
                                <p className="text-yellow-200 text-center font-extrabold drop-shadow-[0_0_1px_black] text-3xl">
                                    {totalTodayCount}
                                </p>
                                <p className="text-white text-center font-poppins text-xs">Totales</p>
                            </Link>
                            <Link to="./pending" className="flex-1 flex-col no-underline justify-center items-center">
                                <p className="text-transparent bg-clip-text text-center bg-gradient-to-br from-yellow-400 to-purple-600 drop-shadow-[0_0_1px_black] font-extrabold text-3xl">
                                    {pendingTodayCount}
                                </p>
                                <p className="text-white text-center font-poppins text-xs">Pendientes</p>
                            </Link>
                            <Link to="./completed" className="flex-1 flex-col no-underline justify-center items-center">
                                <p className="text-purple-400 font-extrabold text-center drop-shadow-[0_0_1px_black] text-3xl">
                                    {completedTodayCount}
                                </p>
                                <p className="text-white text-center font-poppins text-xs">Completas</p>
                            </Link>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Task_count;
