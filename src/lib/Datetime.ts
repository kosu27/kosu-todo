export type TaskType = "today" | "tomorrow" | "other";

export const getDate = (taskType: TaskType) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  if (taskType == "tomorrow") {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

export const getDateEnd = (taskType: TaskType) => {
  const date = getDate(taskType);
  date.setHours(23, 59, 59, 999);
  return date;
};
