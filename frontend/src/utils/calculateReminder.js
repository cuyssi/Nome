export const calculateReminderDateTime = (bag) => {
    const now = new Date();
    const [hours, minutes] = (bag.reminderTime || "20:00").split(":");
    const reminder = new Date(now);
    reminder.setHours(Number(hours), Number(minutes), 0, 0);

    if (bag.type === "personalizada" && Array.isArray(bag.notifyDays) && bag.notifyDays.length) {
        const dayMap = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6, D: 0 };
        const todayDay = now.getDay();
        const daysAhead = bag.notifyDays.map((d) => (dayMap[d] - todayDay + 7) % 7).sort((a, b) => a - b);

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
