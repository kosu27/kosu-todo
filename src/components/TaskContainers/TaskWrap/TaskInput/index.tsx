import { Auth } from "@supabase/ui";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import type { TodoType } from "src/lib/SupabaseClient";
import { editTodo } from "src/lib/SupabaseClient";
import { useToast } from "src/lib/ToastHooks";
import type { CaretColorProps } from "src/type/type";

type Props = {
  item: TodoType;
  updateTodo: () => void;
  setText: Dispatch<SetStateAction<string>>;
  text: string;
  caretColor: CaretColorProps;
};

export const TaskInput = (props: Props) => {
  const { caretColor, item, setText, text, updateTodo } = props;
  const { user } = Auth.useUser();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { errorToast } = useToast();

  const inputstyle = "line-through text-[#C2C6D2] dark:text-gray-400";
  const lineThrough: string = item.iscomplete ? inputstyle : "";

  const handleChangeText = useCallback(
    (e: any) => {
      if (e.target.value.length < 100) {
        setText(e.target.value);
      } else {
        alert("100文字以内で入力してください");
      }
    },
    [setText]
  );

  //編集処理を書く
  const handleEditTask = useCallback(async () => {
    if (text && user) {
      const isSuccess = await editTodo(item.id, text);
      if (isSuccess) {
        updateTodo();
        setText(text);
      } else {
        errorToast("タスクの変更に失敗しました");
      }
    } else {
      setText(item.task);
    }
  }, [text, user, item.id, item.task, updateTodo, setText, errorToast]);

  return (
    <>
      <div className="absolute top-3 left-10 mb-3 w-3/5 text-sm">
        <div
          className={`box-border overflow-hidden ${caretColor} ${lineThrough}  min-h-min text-yellow-100/0 whitespace-pre-wrap break-words`}
        >
          {text}
        </div>
        <textarea
          // id="FlexTextarea"
          value={text}
          className={`box-border block ${caretColor} ${lineThrough}  overflow-hidden absolute top-0 w-full h-full bg-transparent outline-none resize-none`}
          onChange={handleChangeText}
          onBlur={async () => {
            //同じ文言であれば編集しないようにする
            if (item.task !== text) {
              setIsSending(true);
              await handleEditTask();
              setIsSending(false);
            }
          }}
          onKeyPress={async (e) => {
            //同じ文言であれば編集しないようにする
            if (e.key === "Enter" && !isSending && item.task !== text) {
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
