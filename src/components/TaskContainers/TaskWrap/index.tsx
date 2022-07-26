import { FC, useCallback, useMemo } from "react";
import { TaskInput } from "src/components/TaskContainers/TaskWrap/TaskInput";
import { RadioButton } from "src/components/ui/RadioButton/RadioButton";
import { useToast } from "src/lib/ToastHooks";
import { BgColorProps, CaretColorProps, DayProps } from "src/type/type";
import { CgTrash } from "react-icons/cg";
import { MdOutlineContentCopy } from "react-icons/md";
import {
  addTodo,
  deleteTodo,
  editIsComplete,
  TodoType,
} from "src/lib/SupabaseClient";

type Props = {
  day: DayProps;
  item: TodoType;
  updateTodo: () => Promise<void>;
  text: any;
  setText: any;
};

export const TaskWrap: FC<Props> = (props) => {
  const { day, item, setText, text, updateTodo } = props;
  const { errorToast } = useToast();

  const caretColor = useMemo<CaretColorProps>(
    () =>
      day == "today"
        ? "caret-today"
        : day == "tomorrow"
        ? "caret-tomorrow"
        : "caret-other",
    [day]
  );

  const taskColor = useMemo<BgColorProps>(
    () =>
      day == "today"
        ? "checked:bg-today"
        : day == "tomorrow"
        ? "checked:bg-tomorrow"
        : "checked:bg-other",
    [day]
  );

  const handleEditIsComplete = useCallback(
    async (itemId: number, itemiscomplete: boolean) => {
      const isSuccess = await editIsComplete(itemId, itemiscomplete);
      if (isSuccess) {
        updateTodo();
      } else {
        errorToast("isComplete処理に失敗しました。");
      }
    },
    [updateTodo, errorToast]
  );

  const handleDelete = async (id: number) => {
    const isSuccess = await deleteTodo(id);
    if (isSuccess) {
      updateTodo();
    } else {
      errorToast("タスクの削除に失敗しました");
    }
  };

  const handleCopyTask = useCallback(
    async (day: "today" | "tomorrow" | "other") => {
      if (text) {
        const isSuccess = await addTodo(text, day);
        if (isSuccess) {
          updateTodo();
        } else {
          errorToast("タスクの追加に失敗しました");
        }
      }
    },
    [text, updateTodo, errorToast]
  );

  return (
    <>
      <li className="flex justify-between items-center">
        <RadioButton
          handleEditIsComplete={handleEditIsComplete}
          centerColor={taskColor}
          item={item}
        />
        <TaskInput
          item={item}
          text={text}
          setText={setText}
          updateTodo={updateTodo}
          caretColor={caretColor}
        />
        <div className="absolute top-3 right-2 invisible group-hover:visible">
          <div className="flex invisible group-hover:visible gap-2 items-center text-[#696b70] hover:cursor-pointer">
            <MdOutlineContentCopy
              onClick={async () => await handleCopyTask(day)}
            />
            <CgTrash onClick={async () => await handleDelete(item.id)} />
          </div>
        </div>
      </li>
    </>
  );
};
