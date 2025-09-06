import { useState, useEffect } from "react";

export const useItems = (bag, onUpdateBag) => {
  const allItems = Array.isArray(bag.items) ? bag.items : [];
  const packedItems = Array.isArray(bag.packed) ? bag.packed : [];

  const [localPacked, setLocalPacked] = useState(packedItems);

  useEffect(() => {
    setLocalPacked(packedItems);
  }, [bag]);

  const toggleItem = (nombre) => {
    const updatedPacked = localPacked.includes(nombre)
      ? localPacked.filter((i) => i !== nombre)
      : [...localPacked, nombre];

    setLocalPacked(updatedPacked);

    const updatedBag = {
      ...bag,
      packed: updatedPacked,
    };

    onUpdateBag(updatedBag);

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const isComplete =
    allItems.length > 0 && allItems.every((item) => localPacked.includes(item));

  return {
    allItems,
    localPacked,
    toggleItem,
    isComplete,
    packedItems,
  };
};
