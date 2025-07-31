import Container from "../commons/Container";
import { Link } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";

const Task_count = ({ tasks = [] }) => {
  const { todayTasks } = useTasks();
  const completedTodayCount = todayTasks.filter((t) => t.completed).length;
  const pendingTodayCount = todayTasks.filter((t) => !t.completed).length;
  const totalTodayCount = todayTasks.length;

  return (
    <div className="flex w-full justify-center items-center p-2">
      <Container innerClass="justify-between" outerClass="w-[100%]"> 
        <Link to="./today" className="flex-1 flex-col p-2 no-underline justify-center items-center">
          <p className="text-yellow-200 text-center font-extrabold drop-shadow-[0_0_1px_black] text-2xl">
            {totalTodayCount}
          </p>
          <p className="text-white text-center font-poppins text-xs mt-2">Tareas hoy</p>
        </Link>
        <Link to="./pending" className="flex-1 flex-col p-2no-underline items-center">
          <p className="text-transparent bg-clip-text text-center bg-gradient-to-br from-yellow-400 to-purple-600 drop-shadow-[0_0_1px_black] font-extrabold text-2xl">
            {pendingTodayCount}
          </p>
          <p className="text-white text-center font-poppins text-xs mt-2">Pendientes</p>
        </Link>
        <Link to="./completed" className="flex-1 flex-col p-2 no-underline items-center">
          <p className="text-purple-400 font-extrabold text-center drop-shadow-[0_0_1px_black] text-2xl">
            {completedTodayCount}
          </p>
          <p className="text-white text-center font-poppins text-xs mt-2">Completas</p>
        </Link>
        
       
      </Container>
    </div>
  );
};

export default Task_count;
