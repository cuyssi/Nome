import { Item_List } from "../components/commons/Item_List";
import { useBagEditor } from "../hooks/bag/useBagEditor";
import { BagModalManager } from "../components/bags/BagModalManager";
import { useBagsStore } from "../store/useBagsStore";
import { Bag_card } from "../components/bags/Bag_card";
import { CreateBagModal } from "../components/bags/CreateBagModal";
import { useState } from "react";

export const Bags = () => {
    const { isOpen, selectedBag, openModalWithBag, handleEdit, handleClose, renderKey, showConfirmation, deleteBag } =
        useBagEditor();
    const { bags } = useBagsStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
                        onEdit={() => openModalWithBag(bag)}
                    />
                )}
            />
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-400 text-white px-4 py-2 rounded-lg mb-6 hover:bg-purple-700 transition"
            >
                ➕ Crear mochila
            </button>
            <BagModalManager
                isOpen={isOpen}
                selectedBag={selectedBag}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
            />
            <CreateBagModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
};
