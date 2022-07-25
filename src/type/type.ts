import { Dispatch, SetStateAction } from "react";
import { TodoType } from "src/lib/firebase";

export type CaretColorProps = "caret-today" | "caret-tomorrow" | "caret-other";

export type DayProps = "today" | "tomorrow" | "other";
export type HeaderProps = "今日する" | "明日する" | "今度する";
export type ColorProps = "text-today" | "text-tomorrow" | "text-other";
export type BgColorProps =
  | "checked:bg-today"
  | "checked:bg-tomorrow"
  | "checked:bg-other";

export type TaskElement = {
  id: number;
  header: HeaderProps;
  color: ColorProps;
  bgColor: BgColorProps;
  caretColor: CaretColorProps;
  day: DayProps;
};

export type MapTaskElement = {
  taskArray: TodoType[];
  setState: Dispatch<SetStateAction<TodoType[]>>;
  id: number;
  header: HeaderProps;
  color: ColorProps;
  bgColor: BgColorProps;
  caretColor: CaretColorProps;
  day: DayProps;
}[];
