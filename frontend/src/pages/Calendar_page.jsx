import { Calendar } from "../components/calendar/Calendar";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskSearch } from "../components/task/TaskSearch";
import { useTutoCalendar } from "../hooks/calendar/useTutoCalendar";
import { TutoCalendar } from "../components/tutorials/TutoCalendar";

export const Calendar_page = () => {
    const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation } = useTaskEditor();
    const { shouldShowTutorial, setShowModal, hideTutorial } = useTutoCalendar();
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
            {shouldShowTutorial && (
                <TutoCalendar activeTab="calendar" setShowModal={setShowModal} hideTutorial={hideTutorial} />
            )}
        </div>
    );
};
