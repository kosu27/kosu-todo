import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { HiPlusSm } from "react-icons/hi";
import { useCallback, useMemo, useState } from "react";
import { TaskType } from "src/lib/Datetime";
import { db } from "src/lib/firebase";
import { useToast } from "src/lib/ToastHooks";
import { CaretColorProps } from "src/type/type";

type Props = {
  day: TaskType;
  updateTodo: () => Promise<void>;
};

export const NewTask = (props: Props) => {
  const { day, updateTodo } = props;
  const [isSending, setIsSending] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isAddTask, setAddTask] = useState<boolean>(false);
  const [input, setInput] = useState("");
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

  const handleChangeText = useCallback((e: any) => {
    if (e.target.value.length < 100) {
      setText(e.target.value);
    } else {
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>100文字以内で入力してください</AlertTitle>
      </Alert>;
    }
  }, []);

  const newTask = async (day: "today" | "tomorrow" | "other") => {
    //Firebase ver9 compliant (modular)
    await addDoc(collection(db, "todos"), { title: input });
    setInput("");
  };

  const handleClickButton = () => {
    setAddTask(true);
  };

  return (
    <>
      <div className="flex justify-start py-2 px-[0.14rem] mr-16">
        {isAddTask ? (
          <>
            <div
              className={`flex justify-center w-[22px] h-[22px] rounded-full  ring-1 ring-gray-200 mr-2`}
            >
              <button className={`outline-none w-full h-full rounded-full`} />
            </div>
            <div className="relative mb-3 ml-2 w-3/4 text-sm">
              <div
                className={`box-border overflow-hidden ${caretColor} text-yellow-100/0 whitespace-pre-wrap break-words`}
              >
                {text}
              </div>
              <Textarea
                value={text}
                className={`box-border block ${caretColor} min-h-8  h-full overflow-hidden text-sm absolute top-0 w-full bg-transparent outline-none resize-none`}
                onChange={handleChangeText}
                onBlur={async () => {
                  //同じ文言であれば編集しないようにする
                  if (!isSending) {
                    setIsSending(true);
                    await newTask(day);
                    setIsSending(false);
                  }
                  setAddTask(false);
                }}
                onKeyPress={async (e) => {
                  if (e.key === "Enter" && !isSending) {
                    setIsSending(true);
                    await newTask(day);
                    setIsSending(false);
                  }
                }}
                autoFocus
              />
            </div>
          </>
        ) : (
          <>
            <div
              className={`flex justify-center  w-[18px] h-[18px] rounded-full ring-2 ring-gray-300 bg-gray-300 ml-[1px]`}
            >
              <HiPlusSm size={18} className="text-[#ffffff]" />
            </div>
            <Button
              onClick={handleClickButton}
              className="ml-3 h-5 leading-5 placeholder:text-[#C2C6D2] text-gray-400 whitespace-nowrap border-0 focus:ring-0 caret-[#F43F5E]"
            >
              タスクを追加する
            </Button>
          </>
        )}
      </div>
    </>
  );
};
