import { useTasks } from "../hooks/task/useTasks";
import { useFilteredTasks } from "../hooks/task/useFilteredTasks";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { stepsTasks } from "../components/tutorials/tutorials";
import { TabbedTaskView } from "../components/commons/TabbedTaskView";

export const Tasks = () => {
  const { tasks, reload } = useTasks();
  const { deberesTasks, trabajoTasks, examenesTasks } = useFilteredTasks(tasks);
  const useEditor = useTaskEditor;

  const tabTasks = {
    deberes: deberesTasks,
    trabajos: trabajoTasks,
    exámenes: examenesTasks,
  };

  return (
    <TabbedTaskView
      title="Tareas"
      tabLabels={["deberes", "trabajos", "exámenes"]}
      tabTasks={tabTasks}
      tutorialSteps={stepsTasks}
      tutorialKeyPrefix="tasks"
      reload={reload}
      useEditor={useEditor}
    />
  );
};
