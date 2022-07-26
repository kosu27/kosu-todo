import type { FC } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Header } from "src/components/Header";
import { TaskContainers } from "src/components/TaskContainers";
import { taskElement } from "src/constants/TaskElement";
import type { TodoType } from "src/lib/SupabaseClient";
import { getTodo } from "src/lib/SupabaseClient";

export const Index: FC = () => {
  const [todoToday, setTodoToday] = useState<TodoType[]>([]);
  const [todoTomorrow, setTodoTomorrow] = useState<TodoType[]>([]);
  const [todoOther, setTodoOther] = useState<TodoType[]>([]);

  const updateTodo = useCallback(async () => {
    let data = await getTodo("today");
    setTodoToday(data);
    data = await getTodo("tomorrow");
    setTodoTomorrow(data);
    data = await getTodo("other");
    setTodoOther(data);
  }, []);

  useEffect(() => {
    updateTodo();
  }, [updateTodo]);

  const mapTaskElement = [
    {
      ...taskElement[0],
      taskArray: todoToday,
      setState: setTodoToday,
    },
    {
      ...taskElement[1],
      taskArray: todoTomorrow,
      setState: setTodoTomorrow,
    },
    {
      ...taskElement[2],
      taskArray: todoOther,
      setState: setTodoOther,
    },
  ];

  return (
    <>
      <Header />
      <div className="px-4">
        <TaskContainers
          todoToday={todoToday}
          setTodoToday={setTodoToday}
          todoTomorrow={todoTomorrow}
          setTodoTomorrow={setTodoTomorrow}
          todoOther={todoOther}
          setTodoOther={setTodoOther}
          updateTodo={updateTodo}
          mapTaskElement={mapTaskElement}
        />
      </div>
    </>
  );
};
