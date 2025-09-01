import { useTasks } from "../hooks/task/useTasks";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager"
import { TaskPageLayout } from "../components/task/TaskPageLayout";
import { Tasks_list } from "../components/task/Tasks_list";

const Completed_tasks = () => {
    const { todayTasks } = useTasks();
    const completedTasks = todayTasks.filter((task) => task.completed);

    const {
        renderKey,
        isOpen,
        selectedTask,
        openModalWithTask,
        handleEdit,
        handleClose,
        showConfirmation
    } = useTaskEditor();

    return (
        <TaskPageLayout title="Tareas Completadas">
            <Tasks_list
                key={renderKey}
                tasks={completedTasks}
                openModalWithTask={openModalWithTask}
            />
            <TaskModalManager
                isOpen={isOpen}
                selectedTask={selectedTask}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
            />
        </TaskPageLayout>
    );
};

export default Completed_tasks;
