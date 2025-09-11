import { useBagsStore } from "../../store/useBagsStore";
import { notifyBackend, cancelTaskBackend } from "../../services/notifyBackend";
import { buildReminderUrl } from "../../utils/buildReminderUrl";

const toLocalDateTimeString = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const hoursOffset = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const minutesOffset = String(absOffset % 60).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
        date.getMinutes()
    )}:00${sign}${hoursOffset}:${minutesOffset}`;
};

export const calculateReminderDateTime = (bag) => {
    const now = new Date();
    const [hours, minutes] = (bag.reminderTime || "20:00").split(":").map(Number);
    const reminder = new Date(now);
    reminder.setHours(hours, minutes, 0, 0);

    if (bag.type === "personalizada" && Array.isArray(bag.notifyDays) && bag.notifyDays.length) {
        const dayMap = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6, D: 0 };
        const todayDay = now.getDay();

        const daysAhead = bag.notifyDays
            .map((d) => (dayMap[d] - todayDay + 7) % 7)
            .sort((a, b) => a - b);

        const nextOffset =
            daysAhead.find((d) => {
                const candidate = new Date(reminder);
                candidate.setDate(candidate.getDate() + d);
                return candidate > now;
            }) ?? daysAhead[0] ?? 0;

        reminder.setDate(reminder.getDate() + nextOffset);
    }

    return reminder;
};


export const useBag = () => {
    console.log("🟢 useBag hook inicializado");

    const { addBag: baseAddBag, updateBag: baseUpdateBag, deleteBag: baseDeleteBag } = useBagsStore();

    const scheduleNotification = async (bag) => {
        console.log("🟡 scheduleNotification llamado con:", bag);

        const deviceId = localStorage.getItem("deviceId");
        if (!deviceId) return console.log("❌ No hay deviceId, saliendo");

        const localDate = calculateReminderDateTime(bag);
        const dateTimeString = toLocalDateTimeString(localDate);
        const url = buildReminderUrl("bag", bag.name);

        console.log("📦 Enviando al backend →", {
            id: bag.id,
            text: `📚 Recordatorio de mochila: ${bag.name}`,
            dateTime: dateTimeString,
            deviceId,
            type: "bag",
            notifyMinutesBefore: Number(bag.reminder) || 15,
            url
        });

        try {
            await notifyBackend(
                bag.id,
                `📚 Recordatorio de mochila: ${bag.name}`,
                dateTimeString,
                deviceId,
                "bag",
                Number(bag.reminder) || 15,
                url
            );
            console.log("✅ notifyBackend completado");
        } catch (e) {
            console.error("❌ Error en notifyBackend:", e);
        }
    };

    const wrappedAddBag = async (bag) => {
        console.log("➕ wrappedAddBag llamado con:", bag);
        baseAddBag(bag);
        await scheduleNotification(bag);
    };

    const wrappedUpdateBag = async (bag) => {
        console.log("🔄 wrappedUpdateBag llamado con:", bag);
        baseUpdateBag(bag);

        const deviceId = localStorage.getItem("deviceId");
        if (deviceId) {
            await cancelTaskBackend(bag.id, deviceId);
        }

        await scheduleNotification(bag);
    };

    const wrappedDeleteBag = async (id) => {
        console.log("🗑️ wrappedDeleteBag llamado con:", id);
        baseDeleteBag(id);

        const deviceId = localStorage.getItem("deviceId");
        if (deviceId) {
            await cancelTaskBackend(id, deviceId);
        }
    };

    return {
        addBag: wrappedAddBag,
        updateBag: wrappedUpdateBag,
        deleteBag: wrappedDeleteBag
    };
};
