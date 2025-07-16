import Welcome from "../components/commons/Wellcome"
import Task_count from "../components/task/Task_count"
import Voice_rec from "../components/audio/Voice_rec"

const Home = () => {
    return (
        <div>
            <div className="flex flex-col w-full h-[100dvh] items-center bg-black">
                <Welcome />               
                <Voice_rec />
            </div>
        </div>
    );
};

export default Home;
