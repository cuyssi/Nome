export function filterTasks(task_list, types = [], exclude = false) {
  if (!Array.isArray(types)) types = [types];

  return task_list.filter(task => {
    const match = types.includes(task.type);
    return exclude ? !match : match;
  });
}
