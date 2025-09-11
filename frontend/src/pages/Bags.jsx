import { Item_List } from "../components/commons/Item_List";
import { useBagModalManager } from "../hooks/bag/useBagModalManager";
import { BagModalManager } from "../components/bags/BagModalManager";
import { useBagsStore } from "../store/useBagsStore";
import { Bag_card } from "../components/bags/Bag_card";
import { useState } from "react";
import { BagItems } from "../components/bags/BagItems";
import { Plus } from "lucide-react";
import { NotifyBag } from "../components/bags/NotifyBag";
import { TomorrowSubjects } from "../components/bags/TomorrowSubjects";

export const Bags = () => {
    const {
        isOpen,
        openModalWithBag,
        handleEdit,
        handleClose,
        showConfirmation,
        deleteBag,
        mode,
        selectedBag,
        isTomorrowOpen,
        isItemsOpen,
        setTomorrowOpen,
        setItemsOpen,
        openBagFromURL,
    } = useBagModalManager();

    const { bags, editBag } = useBagsStore();

    const handleUpdateBag = (updatedBag) => {
        editBag(updatedBag);
        handleEdit(updatedBag);
    };

    return (
        <div className="flex flex-col items-center h-full bg-black p-4">
            <NotifyBag onOpenBag={(name) => openBagFromURL(name, bags)} />
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-10">Mochilas</h2>
            <Item_List
                items={bags}
                renderItem={(bag) => (
                    <Bag_card
                        key={bag.id}
                        bag={bag}
                        onDelete={() => deleteBag(bag.id)}
                        onOpenModal={(bag, modalMode) => {
                            if (bag.name === "Escolar") {
                                if (modalMode === "school") {
                                    handleEdit(bag); // ✅ actualiza selectedBag
                                    setTomorrowOpen(true);
                                } else if (modalMode === "edit") {
                                    openModalWithBag(bag, "edit");
                                }
                            } else if (modalMode === "items") {
                                handleEdit(bag); // ✅ actualiza selectedBag
                                setItemsOpen(true);
                            } else {
                                openModalWithBag(bag, modalMode);
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
                    onUpdateBag={handleUpdateBag}
                />
            )}
            <button
                onClick={() => openModalWithBag(null, "create")}
                className="bg-purple-400 text-white font-poppins px-4 py-2 rounded-lg mb-6 hover:bg-purple-700 transition"
            >
                <Plus className="inline-block mr-2" /> Crear mochila
            </button>
            console.log("modalBag", modalBag);
            <BagModalManager
                isOpen={isOpen}
                selected={selectedBag}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
                mode={mode}
            />
        </div>
    );
};
