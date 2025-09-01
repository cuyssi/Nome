import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/task/useTasks";
import { useStorageStore } from "../store/storageStore";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager"
import { TaskPageLayout } from "../components/task/TaskPageLayout";

const Pending_tasks = () => {
    const { todayTasks, reload } = useTasks();
    const { updateTask } = useStorageStore();
    const pendingTasks = todayTasks.filter((task) => !task.completed);

    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload, updateTask);

    return (
        <TaskPageLayout title="Tareas Pendientes">
            <Tasks_list key={renderKey} tasks={pendingTasks} openModalWithTask={openModalWithTask} />
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

export default Pending_tasks;
