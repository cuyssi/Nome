import { useBagsStore } from "../../store/useBagsStore";
import { useBagModalManager } from "./useBagModalManager";
import { normalize } from "../../utils/normalize";

export const useOpenModalByName = () => {
    const { bags } = useBagsStore();
    const { openModalWithBag } = useBagModalManager();

    const openModalByName = (bagName, modalMode = null) => {
        const targetName = normalize(bagName);
        const bag = bags.find((b) => normalize(b.name) === targetName);

        console.log("📦 Mochilas disponibles:", bags);
        console.log("🎯 Buscando:", normalize(bagName));

        if (bag) {
            console.log("✅ Mochila encontrada:", bag);
            openModalWithBag(bag, modalMode);
        } else {
            console.warn("❌ Mochila no encontrada:", bagName);
        }
    };

    return { openModalByName };
};
