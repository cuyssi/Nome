import { useTasks } from "../hooks/task/useTasks";
import { useFilteredDates } from "../hooks/dates/useFilteredDates";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { stepsDates } from "../components/tutorials/tutorials";
import { TabbedTaskView } from "../components/commons/TabbedTaskView";

export const Dates = ({ type, exclude = false }) => {
  const { tasks, reload } = useTasks(type, exclude);
  const { citasTasks, medicoTasks, otrosTasks } = useFilteredDates(tasks);
  const useEditor = useTaskEditor;

  const tabTasks = {
    citas: citasTasks,
    médicos: medicoTasks,
    otros: otrosTasks,
  };

  return (
    <TabbedTaskView
      title="Citas"
      tabLabels={["citas", "médicos", "otros"]}
      tabTasks={tabTasks}
      tutorialSteps={stepsDates}
      tutorialKeyPrefix="dates"
      reload={reload}
      useEditor={useEditor}
    />
  );
};
