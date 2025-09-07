import { Item_List } from "../components/commons/Item_List";
import { useBagModalManager } from "../hooks/bag/useBagModalManager";
import { BagModalManager } from "../components/bags/BagModalManager";
import { useBagsStore } from "../store/useBagsStore";
import { Bag_card } from "../components/bags/Bag_card";
import { useState } from "react";
import { BagItems } from "../components/bags/BagItems";

import { TomorrowSubjects } from "../components/bags/TomorrowSubjects";

export const Bags = () => {
    const {
        isOpen,
        selectedBag: modalBag,
        openModalWithBag,
        handleEdit,
        handleClose,
        showConfirmation,
        deleteBag,
        mode,
    } = useBagModalManager();
    const { bags, editBag } = useBagsStore();



    // Actualiza la mochila en store y en local state
    const handleUpdateBag = (updatedBag) => {
        editBag(updatedBag);
        setSelectedBag(updatedBag);
    };

    const [selectedBag, setSelectedBag] = useState(null);
    const [isTomorrowOpen, setTomorrowOpen] = useState(false);
    const [isItemsOpen, setItemsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center h-full bg-black p-4">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-10">Mochilas</h2>
            <Item_List
                items={bags}
                renderItem={(bag) => (
                    <Bag_card
                        key={bag.id}
                        bag={bag}
                        onDelete={() => deleteBag(bag.id)}
                        onOpenModal={(bag) => {
                            setSelectedBag(bag);
                            if (bag.name === "Escolar") {
                                setTomorrowOpen(true);
                            } else {
                                setItemsOpen(true); // abrir BagItems
                            }
                        }}
                    />
                )}
            />
            {selectedBag && selectedBag.name === "Escolar" && (
                <TomorrowSubjects
                    isOpen={isTomorrowOpen}
                    bag={selectedBag}
                    onClose={() => setTomorrowOpen(false)}
                    onUpdateBag={handleUpdateBag}
                />
            )}
            {selectedBag && selectedBag.name !== "Escolar" && (
                <BagItems
                    isOpen={isItemsOpen}
                    bag={selectedBag}
                    onClose={() => setItemsOpen(false)}
                    onUpdateBag={handleUpdateBag} // opcional: persistir cambios
                />
            )}
            <button
                onClick={() => openModalWithBag(null, "create")}
                className="bg-purple-400 text-white px-4 py-2 rounded-lg mb-6 hover:bg-purple-700 transition"
            >
                ➕ Crear mochila
            </button>
            console.log("modalBag", modalBag);
            <BagModalManager
                isOpen={isOpen}
                selected={modalBag} // ✅ usar modalBag
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
                mode={mode}
            />
        </div>
    );
};
