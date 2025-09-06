export const TaskPageLayout = ({ title, children }) => {
    return (
        <div className="flex flex-col h-[100%] items-center overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-3xl mt-14 mb-14 text-center">{title}</h2>
            <div className="w-[90%] h-[90%]">{children}</div>
        </div>
    );
};
