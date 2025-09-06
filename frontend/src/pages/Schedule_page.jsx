import { Schedule } from "../components/schedule/Schedule";

export const Schedule_page = () => {
    return (
        <div className="flex flex-col h-full items-center bg-black ">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-5">Horario</h2>
            <Schedule />
        </div>
    );
};
