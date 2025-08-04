import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";
import { useStorageStore } from "../store/storageStore";
import { useTaskEditor } from "../hooks/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskPageLayout } from "../components/task/TaskPageLayout";

const Today_tasks = () => {
    const { todayTasks, reload } = useTasks();
    const { updateTask } = useStorageStore();
    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload, updateTask);

    return (
        <TaskPageLayout title="Tareas para Hoy">
            <Tasks_list key={renderKey} tasks={todayTasks} openModalWithTask={openModalWithTask} />
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

export default Today_tasks;
