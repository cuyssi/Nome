import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Dates from "./pages/Dates";
// import Schedule from "./pages/Schedule"
// import Bags from "./pages/Bags"
import Footer from "./components/commons/Footer";
// import Completed_tasks from "./pages/Completed_tasks"
// import Pending_tasks from "./pages/Pending_tasks"
// import Today_tasks from "./pages/Today_tasks"

function App() {
    return (
        <div className="flex bg-black flex-col sm:flex-col w-[100%] min-h-[100dvh] sm:items-center sm:justify-center">
            <main className="bg-black h-[100%] flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tasks" element={<Task />} />
                    <Route path="/dates" element={<Dates />} />
                    //{" "}
                    {/* <Route path="/schedule" element={<Schedule />} />
    //   <Route path="/bags" element={<Bags />} />
    //   <Route path="/completed" element={<Completed_tasks />} />
    //   <Route path="/pending" element={<Pending_tasks />} />
    //   <Route path="/today" element={<Today_tasks />} /> */}
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
