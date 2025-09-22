import { useState, useRef } from "react";

export const useDraggable = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (e) => {
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX - offset.x, y: clientY - offset.y };

    const handleMove = (moveEvent) => {
      const moveX = moveEvent.type === "touchmove" ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = moveEvent.type === "touchmove" ? moveEvent.touches[0].clientY : moveEvent.clientY;
      setOffset({ x: moveX - startPos.current.x, y: moveY - startPos.current.y });
    };

    const handleEnd = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
  };

  return {
    offset,
    handleStart,
  };
};
