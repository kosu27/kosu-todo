import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { TaskWrap } from "src/components/TaskContainers/TaskWrap";
import { TaskType } from "src/lib/Datetime";
import { TodoType } from "src/lib/SupabaseClient";

type Props = {
  taskType: TaskType;
  todoTask: TodoType;
  updateTodo: () => Promise<void>;
};

export const SortableItem = (props: Props) => {
  const { taskType, todoTask, updateTodo } = props;
  const [text, setText] = useState<string>(todoTask.title);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: String(todoTask.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group relative w-full"
    >
      <div className="absolute top-0 w-full" {...listeners}>
        <div
          className="box-border overflow-hidden my-3 ml-10 w-3/5 text-sm text-blue-800/0 whitespace-pre-wrap break-words"
          // aria-hidden="true"
        >
          {text}
        </div>
      </div>
      <TaskWrap
        updateTodo={updateTodo}
        item={todoTask}
        day={taskType}
        setText={setText}
        text={text}
      />
    </div>
  );
};
