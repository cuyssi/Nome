const Container = ({ children, outerClass="", innerClass="" }) => {
  return (
    <div className={`flex justify-center items-center p-[1px] bg-gradient-to-br from-yellow-400 to-purple-600 rounded-2xl ${outerClass}`}>        
      <div className={`flex p-2 justify-center items-center w-full border border-none rounded-2xl bg-black ${innerClass}`}>
      {children}
      </div>
    </div>
  );
};

export default Container;
