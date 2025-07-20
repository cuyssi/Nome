import { Task_card } from "./Task_card";
import { useTasks } from "../../hooks/useTasks";
import { useModalWithTask } from "../../hooks/useModalWithTask";
import { Modal } from "../commons/Modal";
import Form from "../commons/Form";

export const Tasks_list = ({ type, exclude = false }) => {
    const { tasks, deleteTask, editTask } = useTasks(type, exclude);
    const {
        isOpen,
        selectedTask,
        openModalWithTask,
        closeModal
    } = useModalWithTask();

    return (
        <div className="flex flex-col gap-8 items-center w-full h-[74%] overflow-y-auto px-2 py-4 ">
            {tasks.map((task) => {
                return <Task_card key={task.id} task={task} onDelete={deleteTask} onEdit={() => openModalWithTask(task)} />;
            })}
            {isOpen && selectedTask && (
        <Modal onClose={closeModal}>
          <Form
            initialTask={selectedTask}
            onSubmit={(updatedTask) => {              
              editTask(updatedTask.id);
              closeModal();
            }}
          />
        </Modal>
      )}
        </div>
    );
};
