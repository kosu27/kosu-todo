import type { TaskElement } from "src/type/type";

export const taskElement: TaskElement[] = [
  {
    id: 1,
    header: "今日する",
    color: "text-today",
    bgColor: "checked:bg-today",
    caretColor: "caret-today",
    day: "today",
  },
  {
    id: 2,
    header: "明日する",
    color: "text-tomorrow",
    bgColor: "checked:bg-tomorrow",
    caretColor: "caret-tomorrow",
    day: "tomorrow",
  },
  {
    id: 3,
    header: "今度する",
    color: "text-other",
    bgColor: "checked:bg-other",
    caretColor: "caret-other",
    day: "other",
  },
];
