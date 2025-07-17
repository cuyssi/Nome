import { useState, useEffect } from "react";
import { Tasks_list } from "../components/task/Tasks_list";

const Dates = () => {
    const [activeTab, setActiveTab] = useState("citas");
   
    return (
        <div>
            <div className="flex flex-col h-[100vh] items-center">
                <h2 className="text-purple-400 text-4xl font font-bold font-poppins mt-6 underline-offset-8 decoration-[3px] mb-6">
                    Citas
                </h2>
               
                <div className="w-full  mt-5">
                    <button
                        onClick={() => setActiveTab("citas")}
                        className={`relative px-6 py-2 border border-purple-400 border-l-black rounded-tr-xl font-semibold transition ${
                            activeTab === "citas" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                        }`}
                    >
                        Citas
                    </button>
                    <button
                        onClick={() => setActiveTab("medico")}
                        className={`relative px-6 py-2 border border-purple-400  rounded-t-xl font-semibold transition ${
                            activeTab === "medico" ? "bg-black border-b-black z-20 text-white " : "bg-gray-600 "
                        }`}
                    >
                        Médicos
                    </button>
                </div>
                <div
                    className={`relative border border-black border-t-purple-400 -mt-0.5 w-full h-[100%]  px-4 py-6 transition-colors duration-300 ${
                        activeTab === "citas" ? "bg-black" : activeTab === "medico" ? "bg-black" : "bg-gray-200"
                    }`}
                >
                    {activeTab === "medico" ? (
                        <Tasks_list type="medico" />
                    ) : (
                        <Tasks_list type={["medico", "deberes", "trabajo"]} exclude />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dates;
