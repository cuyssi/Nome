import { useState, useEffect } from "react";
import { Tasks_list } from "../components/task/Tasks_list";

const Task = () => {
    const [activeTab, setActiveTab] = useState("deberes");
   
    return (
        <div>
            <div className="flex flex-col h-[100vh] items-center border border-black">
                <h2 className="text-purple-400 font font-bold font-poppins text-4xl underline-offset-8 decoration-[3px] mt-6 mb-10">
                    Tareas
                </h2>

                {/* Tabs */}
                <div className="w-full mt-2">
                    <button
                        onClick={() => setActiveTab("deberes")}
                        className={`relative px-6 py-2 border border-purple-400 border-l-black rounded-tr-xl font-semibold transition ${
                            activeTab === "deberes" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                        }`}
                    >
                        Deberes
                    </button>
                    <button
                        onClick={() => setActiveTab("trabajo")}
                        className={`relative px-6 py-2 border border-purple-400  rounded-t-xl font-semibold transition ${
                            activeTab === "trabajo" ? "bg-black border-b-black z-20 text-white " : "bg-gray-600 "
                        }`}
                    >
                        Trabajos
                    </button>
                </div>
                <div
                    className={`relative border border-black border-t-purple-400 -mt-0.5 w-full h-[100vh]  px-4 py-6 transition-colors duration-300 ${
                        activeTab === "deberes" ? "bg-black" : activeTab === "trabajo" ? "bg-black" : "bg-gray-200"
                    }`}
                >
                    {activeTab === "trabajo" ? (
                        <Tasks_list type="trabajo" />
                    ) : (
                        <Tasks_list type={["deberes", "ejercicios", "estudiar"]} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Task;
