import { RefreshCw } from "lucide-react";

export function getRepeatLabel(task) {
  if (!task.repeat || task.repeat === "once") {
    return <span className="text-gray-400">{task.date}</span>;
  }
  if (task.repeat === "daily") {
    return <RefreshCw className="inline w-8 h-8 text-purple-500" />;
  }
  if (task.repeat === "weekdays") {
    return <span className="text-blue-400 font-bold">L-V</span>;
  }
  if (task.repeat === "custom" && task.customDays?.length) {
    const daysMap = ["L", "M", "X", "J", "V", "S", "D"];
    return (
      <span className="text-purple-500 text-sm text-center">
        {task.customDays.map((d) => daysMap[d]).join(", ")}
      </span>
    );
  }
  return null;
}
