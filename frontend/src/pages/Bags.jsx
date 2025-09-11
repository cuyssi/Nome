import { Item_List } from "../components/commons/Item_List";
import { useBagModalManager } from "../hooks/bag/useBagModalManager";
import { BagModalManager } from "../components/bags/BagModalManager";
import { useBagsStore } from "../store/useBagsStore";
import { Bag_card } from "../components/bags/Bag_card";
import { Plus } from "lucide-react";
import { NotifyBag } from "../components/bags/NotifyBag";
import { useBag } from "../hooks/bag/useBag";


export const Bags = () => {
    const {
        isOpen,
        openModalWithBag,
        handleEdit,
        handleClose,
        showConfirmation,
        setSelectedBag,        
        mode,
        selectedBag,
        openBagFromURL,
    } = useBagModalManager();

    const { bags, editBag } = useBagsStore();
    const { deleteBag } = useBag();


    const handleUpdateBag = (updatedBag, options = {}) => {
        const { closeAfterSave = false, skipConfirmation = false } = options;
        editBag(updatedBag);

        if (closeAfterSave) {
            handleEdit(updatedBag);
        } else {
            setSelectedBag(updatedBag);
        }
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
                            openModalWithBag(bag, modalMode);
                        }}
                    />
                )}
            />
            <button
                onClick={() => openModalWithBag(null, "create")}
                className="bg-purple-400 text-white font-poppins px-4 py-2 rounded-lg mb-6 hover:bg-purple-700 transition"
            >
                <Plus className="inline-block mr-2" /> Crear mochila
            </button>
            <BagModalManager
                isOpen={isOpen}
                selected={selectedBag}
                showConfirmation={showConfirmation}
                onEdit={handleUpdateBag}
                onClose={handleClose}
                mode={mode}
            />
        </div>
    );
};
