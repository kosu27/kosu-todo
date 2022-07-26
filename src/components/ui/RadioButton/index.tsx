import type { FC } from "react";
import { useCallback } from "react";
import type { TodoType } from "src/lib/SupabaseClient";

type Style = {
  centerColor: string;
  handleEditIsComplete: (
    itemId: number,
    itemiscomplete: boolean
  ) => Promise<void>;
  item: TodoType;
};

export const RadioButton: FC<Style> = (props) => {
  const { centerColor, handleEditIsComplete, item } = props;
  const bgColor: string = item.iscomplete
    ? centerColor
    : "bg-white dark:bg-[#22272E]";

  const handleJudgeCompleted = useCallback(() => {
    handleEditIsComplete(item.id, !item.iscomplete);
  }, [item.iscomplete, item.id, handleEditIsComplete]);

  return (
    <>
      <div onClick={handleJudgeCompleted} className="absolute top-2">
        <input
          type="radio"
          className={`${bgColor} radio dark:checked:boxshadow-radio-dark checked:boxshadow-radio-light border-gray-200  outline-none focus:outline-none checked:outline-none`}
          readOnly
          checked={item.iscomplete}
        ></input>
      </div>
    </>
  );
};
