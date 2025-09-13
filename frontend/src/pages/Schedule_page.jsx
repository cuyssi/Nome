import { Schedule } from "../components/schedule/Schedule";
import { useTutoSchedule } from "../hooks/schedule/useTutoSchedule";
import { TutoSchedule } from "../components/tutorials/TutoSchedule";

export const Schedule_page = () => {
    const { shouldShowTutorial, setShowModal, hideTutorial } = useTutoSchedule();

    return (
        <div className="flex flex-col h-full items-center bg-black ">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-5">Horario</h2>
            <Schedule />
            {shouldShowTutorial && (
                <TutoSchedule activeTab="schedule" setShowModal={setShowModal} hideTutorial={hideTutorial} />
            )}
        </div>
    );
};
