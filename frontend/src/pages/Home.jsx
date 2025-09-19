import Welcome from "../components/commons/Wellcome";
import Voice_rec from "../components/audio/Voice_rec";
import Task_count from "../components/task/Task_count";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsHome } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";

export const Home = () => {
    const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation } = useTaskEditor();
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const shouldShowTutorial = !useTutorialStore((state) => state.isHidden("home"));

    return (
        <div className="flex flex-col w-full h-full items-center bg-black overflow-hidden">
            <div className="flex flex-col w-full h-full items-center bg-black">
                <Welcome />
                <Task_count />
                <Voice_rec openModalWithTask={openModalWithTask} />

                <TaskModalManager
                    isOpen={isOpen}
                    selectedTask={selectedTask}
                    showConfirmation={showConfirmation}
                    onEdit={handleEdit}
                    onClose={handleClose}
                />

                {shouldShowTutorial && (
                    <TutorialModal
                        activeTab="home"
                        steps={stepsHome}
                        isOpen={shouldShowTutorial}
                        onNeverShowAgain={() => hideTutorial("home")}
                    />
                )}
            </div>
        </div>
    );
};
