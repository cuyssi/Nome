const Container = ({ children,  outerClass = "", innerClass = "" }) => {
    return (
        <div className={`flex w-[95%] justify-end items-center border border-black p-[1px] rounded-xl pl-2 ${outerClass}`}>
            <div className={`flex flex-row justify-between border-1 ${innerClass} items-center w-full p-1 font-bold bg-black rounded-xl`}>
            {children}
            </div>
        </div>
    );
};

export default Container;
