import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTaskEditor } from "../hooks/useTaskEditor";
import { useStorageStore } from "../store/storageStore";
import { TaskPageLayout } from "../components/task/TaskPageLayout";

const Completed_tasks = () => {
    const { todayTasks, reload } = useTasks();
    const { updateTask } = useStorageStore();
    const completedTasks = todayTasks.filter((task) => task.completed);
    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload, updateTask);

    return (
        <TaskPageLayout title="Tareas para Hoy">
            <Tasks_list key={renderKey} tasks={completedTasks} openModalWithTask={openModalWithTask} />
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
