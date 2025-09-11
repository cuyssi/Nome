import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const NotifyBag = ({ onOpenBag }) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openBag = params.get("open");

    if (openBag && onOpenBag) {
      console.log("🔍 Abriendo desde URL:", openBag);
      onOpenBag(openBag);
    }
  }, [location]);

  return null;
};
