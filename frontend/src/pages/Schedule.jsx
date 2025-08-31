import { Calendar } from "../components/commons/Calendar";
import { useTaskEditor } from "../hooks/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskSearch } from "../components/task/TaskSearch"
const Schedule = () => {
  const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation } = useTaskEditor();

  return (
    <div className="flex flex-col items-center h-screen bg-black p-4">
      <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-10">Calendario</h2>
      <Calendar openModalWithTask={openModalWithTask} />
      <TaskSearch openModalWithTask={openModalWithTask} />
      <TaskModalManager
        isOpen={isOpen}
        selectedTask={selectedTask}
        showConfirmation={showConfirmation}
        onEdit={handleEdit}
        onClose={handleClose}
      />
    </div>
  );
};

export default Schedule;
