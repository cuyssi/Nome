import "./App.css";
import { useEffect } from "react"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Dates from "./pages/Dates";
import { Footer } from "./components/commons/Footer";
import Completed_tasks from "./pages/Completed_tasks";
import Pending_tasks from "./pages/Pending_tasks";
import Today_tasks from "./pages/Today_tasks";
import { ensureDeviceId } from "./utils/ensureDeviceId"
import { subscribeUser } from "./hooks/notification/usePushNotifications";
import { Schedule_page } from "./pages/Schedule_page";
import { Calendar_page } from "./pages/Calendar_page";
import { Bags } from "./pages/Bags";
import clsx from "clsx";

function App() {
    useEffect(() => {
    ensureDeviceId();
    subscribeUser();
  }, []);

    return (
        <div className="flex flex-col sm:flex-row w-full h-[100dvh] sm:items-center sm:justify-center sm:bg-gray-400">
<div
  className={clsx(
    "relative",
    "w-full h-full bg-white flex flex-col",
    "sm:max-w-[360px] sm:h-[90%] sm:rounded-xl sm:shadow-md sm:overflow-hidden"
  )}
>
                <main className="bg-black flex-1 overflow-y-auto border border-black">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Task />} />
                        <Route path="/dates" element={<Dates />} />
                        <Route path="/today" element={<Today_tasks />} />
                        <Route path="/completed" element={<Completed_tasks />} />
                        <Route path="/pending" element={<Pending_tasks />} />
                        <Route path="/calendar" element={<Calendar_page />} />
                        <Route path="/schedule" element={<Schedule_page />} />
                        <Route path="/bags" element={<Bags />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default App;