export const filterByType = (tasks, types) => {
        const targetTypes = Array.isArray(types) ? types : [types];
        return tasks.filter((t) => {
            const currentTypes = Array.isArray(t.type) ? t.type : [t.type];
            return currentTypes.some((type) => targetTypes.includes(type));
        });
    };