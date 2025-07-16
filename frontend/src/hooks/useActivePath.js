import { useLocation } from "react-router-dom";

const useActivePath = () => {
  const location = useLocation();

  const getIconClass = (path) =>
    location.pathname === path
      ? "text-gray-500 drop-shadow-[0_1px_1px_black]"
      : "text-purple-400";

  return { getIconClass };
};

export default useActivePath;
