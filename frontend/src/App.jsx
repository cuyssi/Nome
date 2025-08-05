import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Dates from "./pages/Dates";
import { Footer } from "./components/commons/Footer";
import Completed_tasks from "./pages/Completed_tasks";
import Pending_tasks from "./pages/Pending_tasks";
import Today_tasks from "./pages/Today_tasks";
import clsx from "clsx";

function App() {
    return (
        <div className="flex flex-col sm:flex-row w-full h-[100dvh] sm:items-center sm:justify-center sm:bg-gray-400">
            <div
                className={clsx(
                    "w-full h-full bg-white flex flex-col",
                    "sm:w-[360px] sm:h-[80%] sm:rounded-xl sm:shadow-md sm:overflow-hidden"
                )}
            >
                <main className="bg-black flex-1 overflow-y-auto p-2 border border-black">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Task />} />
                        <Route path="/dates" element={<Dates />} />
                        <Route path="/today" element={<Today_tasks />} />
                        <Route path="/completed" element={<Completed_tasks />} />
                        <Route path="/pending" element={<Pending_tasks />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default App;