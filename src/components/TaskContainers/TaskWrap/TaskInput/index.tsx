import { Alert, AlertIcon, AlertTitle, Textarea } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { editTodo, TodoType } from "src/lib/SupabaseClient";
import { useToast } from "src/lib/ToastHooks";
import { CaretColorProps } from "src/type/type";

type Props = {
  item: TodoType;
  updateTodo: () => void;
  setText: Dispatch<SetStateAction<string>>;
  text: string;
  caretColor: CaretColorProps;
};

export const TaskInput = (props: Props) => {
  const { caretColor, item, setText, text, updateTodo } = props;
  const [isSending, setIsSending] = useState<boolean>(false);
  const { errorToast } = useToast();

  const inputstyle = "line-through text-[#C2C6D2] dark:text-gray-400";
  const lineThrough: string = item.iscomplete ? inputstyle : "";

  const handleChangeText = useCallback(
    (e: any) => {
      if (e.target.value.length < 100) {
        setText(e.target.value);
      } else {
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>100文字以内で入力してください</AlertTitle>
        </Alert>;
      }
    },
    [setText]
  );

  //編集処理を書く
  const handleEditTask = useCallback(async () => {
    if (text) {
      const isSuccess = await editTodo(item.id, text);
      if (isSuccess) {
        updateTodo();
        setText(text);
      } else {
        errorToast("タスクの変更に失敗しました");
      }
    } else {
      setText(item.title);
    }
  }, [text, item.id, item.title, updateTodo, setText, errorToast]);

  return (
    <>
      <div className="absolute top-3 left-10 mb-3 w-3/5 text-sm">
        <div
          className={`box-border overflow-hidden ${caretColor} ${lineThrough}  min-h-min text-yellow-100/0 whitespace-pre-wrap break-words`}
        >
          {text}
        </div>
        <Textarea
          // id="FlexTextarea"
          value={text}
          className={`box-border block ${caretColor} ${lineThrough}  overflow-hidden absolute top-0 w-full h-full bg-transparent outline-none resize-none`}
          onChange={handleChangeText}
          onBlur={async () => {
            //同じ文言であれば編集しないようにする
            if (item.title !== text) {
              setIsSending(true);
              await handleEditTask();
              setIsSending(false);
            }
          }}
          onKeyPress={async (e) => {
            //同じ文言であれば編集しないようにする
            if (e.key === "Enter" && !isSending && item.title !== text) {
              e.currentTarget.blur();
              setIsSending(true);
              await handleEditTask();
              setIsSending(false);
            }
          }}
        />
      </div>
      <div className="box-border overflow-hidden my-3 ml-10 w-3/5 min-h-min text-sm text-yellow-600/0 whitespace-pre-wrap break-words">
        {text}
      </div>
    </>
  );
};
