/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Bags: componente principal de la vista de Mochilas.                                             │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Muestra la lista de mochilas disponibles obtenidas del store `useBagsStore`.                │
 *   • Permite abrir, crear, editar y eliminar mochilas usando `useBagModalManager` y `useBag`.    │
 *   • Incluye notificaciones de mochilas mediante `NotifyBag`.                                    │
 *   • Gestiona la visibilidad de tutoriales con `useTutoBags` y muestra `TutoBags` si es          │
 *     necesario.                                                                                  │
 *                                                                                                 │
 * Componentes y hooks utilizados:                                                                 │
 *   - Item_List: lista genérica para renderizar mochilas.                                         │
 *   - Bag_card: tarjeta individual de cada mochila.                                               │
 *   - BagModalManager: modal para crear/editar mochilas.                                          │
 *   - NotifyBag: componente para notificaciones y apertura rápida de mochilas.                    │
 *   - useBagsStore: store de Zustand para acceder y modificar mochilas.                           │
 *   - useBag: hook para operaciones sobre mochilas (eliminar, agregar).                           │
 *   - useBagModalManager: hook que centraliza lógica de modales de mochilas.                      │
 *   - useTutoBags / TutoBags: tutorial interactivo de mochilas.                                   │
 *                                                                                                 │
 * Funciones principales:                                                                          │
 *   - handleUpdateBag(updatedBag, options): actualiza la mochila, mostrando confirmación si se    │
 *     indica.                                                                                     │
 *   - openModalWithBag: abre el modal de la mochila seleccionada o para crear una nueva.          │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { Item_List } from "../components/commons/Item_List";
import { BagModalManager } from "../components/bags/BagModalManager";
import { useBagsStore } from "../store/useBagsStore";
import { Bag_card } from "../components/bags/Bag_card";
import { Plus } from "lucide-react";
import { NotifyBag } from "../components/bags/NotifyBag";
import { useBag } from "../hooks/bag/useBag";
import { useBagModalManager } from "../hooks/bag/useBagModalManager";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsBags } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";
import { ButtonDefault } from "../components/commons/buttons/ButtonDefault"


export const Bags = () => {
    const { bags, editBag } = useBagsStore();
    const { deleteBag } = useBag();
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const shouldShowTutorial = !useTutorialStore((state) => state.isHidden("bags"));
    const { isOpen, selectedBag, mode, showConfirmation, openModalWithBag, handleEdit, handleClose, openBagFromURL } =
        useBagModalManager();

    const handleUpdateBag = (updatedBag, options = {}) => {
        const { closeAfterSave = false, skipConfirmation = false } = options;
        editBag(updatedBag);

        if (closeAfterSave) {
            handleEdit(updatedBag);
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
                        onOpenModal={openModalWithBag}
                    />
                )}
            />

            <ButtonDefault onClick={() => openModalWithBag(null, "create")} icon={<Plus className="inline-block mr-2" />} text="Crear Mochila" className="bg-purple-400 rounded-lg py-2 px-4" />

            <BagModalManager
                isOpen={isOpen}
                selected={selectedBag}
                showConfirmation={showConfirmation}
                onEdit={handleUpdateBag}
                onClose={handleClose}
                mode={mode}
            />

            {shouldShowTutorial && (
                <TutorialModal
                    activeTab="bags"
                    steps={stepsBags}
                    isOpen={shouldShowTutorial}
                    onNeverShowAgain={() => hideTutorial("bags")}
                />
            )}
        </div>
    );
};
