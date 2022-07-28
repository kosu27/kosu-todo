import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Over,
} from "@dnd-kit/core";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import type { TaskType } from "src/lib/Datetime";
import type { TodoType } from "src/lib/SupabaseClient";
import { getTodo } from "src/lib/SupabaseClient";
import { moveTodo } from "src/lib/SupabaseClient";
import { useToast } from "src/lib/ToastHooks";
import type { MapTaskElement } from "src/type/type";

import { Container } from "./container";

type Props = {
  todoToday: TodoType[];
  setTodoToday: Dispatch<SetStateAction<TodoType[]>>;
  todoTomorrow: TodoType[];
  setTodoTomorrow: Dispatch<SetStateAction<TodoType[]>>;
  todoOther: TodoType[];
  setTodoOther: Dispatch<SetStateAction<TodoType[]>>;
  updateTodo: () => Promise<void>;
  mapTaskElement: MapTaskElement;
};

export const TaskContainers = (props: Props) => {
  const {
    mapTaskElement,
    setTodoOther,
    setTodoToday,
    setTodoTomorrow,
    todoOther,
    todoToday,
    todoTomorrow,
    updateTodo,
  } = props;
  const [activeId, setActiveId] = useState<number>(-1);
  const [sourceContainer, setSourceContainer] = useState<TaskType | null>(null);
  const [targetContainer, setTargetContainer] = useState<TaskType | null>(null);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const { errorToast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string | number): TaskType => {
    let filtered = todoToday.filter((todo) =>
      todo.id == Number(id) ? true : false
    );
    if (filtered.length == 1) {
      return "today";
    }
    filtered = todoTomorrow.filter((todo) =>
      todo.id == Number(id) ? true : false
    );
    if (filtered.length == 1) {
      return "tomorrow";
    }
    filtered = todoOther.filter((todo) =>
      todo.id == Number(id) ? true : false
    );
    if (filtered.length == 1) {
      return "other";
    }
    if (id == "today") {
      return "today";
    }
    if (id == "tomorrow") {
      return "tomorrow";
    }
    return "other";
  };

  // つかんだとき;
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;

    const activeContainer = findContainer(id);
    setSourceContainer(activeContainer);
  };

  //動かして他の要素の上に移動した時
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over as Over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const activeItems =
      activeContainer === "today"
        ? todoToday
        : activeContainer === "tomorrow"
        ? todoTomorrow
        : todoOther;
    const overItems =
      overContainer === "today"
        ? todoToday
        : overContainer === "tomorrow"
        ? todoTomorrow
        : todoOther;

    const activeIndex = activeItems.findIndex((item) => item.id === Number(id));
    const overIndex = overItems.findIndex((item) => item.id === Number(overId));

    const newIndex = overIndex + 1;
    let newItem: TodoType;

    if (activeContainer === "today") {
      newItem = todoToday[activeIndex];
      setTodoToday([...todoToday.filter((item) => item.id !== Number(id))]);
    } else if (activeContainer === "tomorrow") {
      newItem = todoTomorrow[activeIndex];
      setTodoTomorrow([
        ...todoTomorrow.filter((item) => item.id !== Number(id)),
      ]);
    } else {
      newItem = todoOther[activeIndex];
      setTodoOther([...todoOther.filter((item) => item.id !== Number(id))]);
    }

    if (overContainer === "today") {
      setTodoToday([
        ...todoToday.slice(0, newIndex),
        newItem,
        ...todoToday.slice(newIndex, todoToday.length),
      ]);
    } else if (overContainer === "tomorrow") {
      setTodoTomorrow([
        ...todoTomorrow.slice(0, newIndex),
        newItem,
        ...todoTomorrow.slice(newIndex, todoTomorrow.length),
      ]);
    } else {
      setTodoOther([
        ...todoOther.slice(0, newIndex),
        newItem,
        ...todoOther.slice(newIndex, todoOther.length),
      ]);
    }
  };

  //要素を離したとき
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over as Over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    setActiveId(Number(id));
    setTargetContainer(activeContainer);

    const items =
      activeContainer === "today"
        ? todoToday
        : activeContainer === "tomorrow"
        ? todoTomorrow
        : todoOther;

    const activeIndex = items.findIndex((item) => item.id === Number(id));
    const overIndex = items.findIndex((item) => item.id === Number(overId));

    if (activeContainer === sourceContainer) {
      setTargetIndex(activeIndex < overIndex ? overIndex + 1 : overIndex);
    } else {
      setTargetIndex(overIndex);
    }

    if (activeIndex !== overIndex) {
      if (activeContainer === "today") {
        setTodoToday(arrayMove(todoToday, activeIndex, overIndex));
      } else if (activeContainer === "tomorrow") {
        setTodoTomorrow(arrayMove(todoTomorrow, activeIndex, overIndex));
      } else {
        setTodoOther(arrayMove(todoOther, activeIndex, overIndex));
      }
    }
  };

  const handleMove = useCallback(async () => {
    if (targetContainer) {
      const todo = await getTodo(targetContainer);
      const isOk = await moveTodo(todo, activeId, targetIndex, targetContainer);
      if (!isOk) {
        errorToast("更新に失敗しました。");
      } else {
        updateTodo();
        setActiveId(-1);
        setTargetContainer(null);
        setTargetIndex(-1);
      }
    }
  }, [activeId, errorToast, targetContainer, targetIndex, updateTodo]);

  useEffect(() => {
    if (activeId != -1 && targetContainer && targetIndex != -1) {
      handleMove();
    }
  }, [activeId, targetContainer, targetIndex, handleMove]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="container grid grid-cols-1 gap-x-10 mx-auto mt-8 max-w-screen-2xl md:grid-cols-3">
        <div className="mb-10">
          <div className={`mb-2 text-xl  font-bold ${mapTaskElement[0].color}`}>
            {mapTaskElement[0].header}
          </div>
          <Container
            taskType="today"
            todo={todoToday}
            updateTodo={updateTodo}
          />
        </div>
        <div className="mb-10">
          <div className={`mb-2 text-xl font-bold ${mapTaskElement[1].color}`}>
            {mapTaskElement[1].header}
          </div>
          <Container
            taskType="tomorrow"
            todo={todoTomorrow}
            updateTodo={updateTodo}
          />
        </div>
        <div className="mb-10">
          <div className={`mb-2 text-xl font-bold ${mapTaskElement[2].color}`}>
            {mapTaskElement[2].header}
          </div>
          <Container
            taskType="other"
            todo={todoOther}
            updateTodo={updateTodo}
          />
        </div>
      </div>
    </DndContext>
  );
};
