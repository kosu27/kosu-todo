import { Input } from "@chakra-ui/react";
import { FC, useCallback } from "react";
import { TodoType } from "src/lib/firebase";

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
  const bgColor: string = item.iscomplete ? centerColor : "bg-white";

  const handleJudgeCompleted = useCallback(() => {
    handleEditIsComplete(item.id, !item.iscomplete);
  }, [item.iscomplete, item.id, handleEditIsComplete]);

  return (
    <>
      <div onClick={handleJudgeCompleted} className="absolute top-2">
        <Input
          type="radio"
          readOnly
          checked={item.iscomplete}
          className={`${bgColor} radio checked:boxshadow-radio-light border-gray-200  outline-none focus:outline-none checked:outline-none`}
        />
      </div>
    </>
  );
};
