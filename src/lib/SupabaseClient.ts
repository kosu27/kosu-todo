import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import type { TaskType } from "src/lib/Datetime";
import { getDate, getDateEnd } from "src/lib/Datetime";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL) {
  throw new Error("環境変数が未定義 : process.env.NEXT_PUBLIC_SUPABASE_URL!");
}
if (!SUPABASE_ANON_KEY) {
  throw new Error("環境変数が未定義 : process.env.NEXT_PUBLIC_SUPABASE_KEY!");
}

export const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type TodoType = {
  id: number;
  uid: string;
  inserted: Date;
  task: string;
  deadline: Date | null;
  iscomplete: boolean;
  sortkey: number | null;
};

export type ProfileType = {
  id: number;
  uid: string;
  username: string;
  avatar: string;
};

export const addTodo = async (
  uid: string,
  task: string,
  taskType: TaskType
) => {
  const deadline = taskType == "other" ? null : getDate(taskType);
  const { error } = await client.from<TodoType>("todos").insert([
    {
      uid: uid,
      task: task,
      deadline: deadline,
      iscomplete: false,
    },
  ]);
  if (error) {
    return false;
  } else {
    return true;
  }
};

const sortTodos = (todos: TodoType[]) =>
  todos.sort((a, b) => {
    const keyA = a.sortkey ? a.sortkey : a.id;
    const keyB = b.sortkey ? b.sortkey : b.id;
    return keyA < keyB ? -1 : 1;
  });

export const getTodo = async (taskType: TaskType) => {
  if (taskType != "other") {
    const start = getDate(taskType);
    const end = getDateEnd(taskType);
    const { data, error } = await client
      .from<TodoType>("todos")
      .select("*")
      .gte("deadline", start.toISOString())
      .lte("deadline", end.toISOString());
    if (error || !data) {
      return [];
    } else {
      return sortTodos(data);
    }
  } else {
    const { data, error } = await client
      .from<TodoType>("todos")
      .select("*")
      .is("deadline", null);
    if (error || !data) {
      return [];
    } else {
      return sortTodos(data);
    }
  }
};

export const editTodo = async (id: number, task: string) => {
  const { error } = await client
    .from("todos")
    .update({ task: task })
    .eq("id", id);

  if (error) {
    return false;
  } else {
    return true;
  }
};

export const deleteTodo = async (id: number) => {
  const { data, error } = await client
    .from<TodoType>("todos")
    .delete()
    .eq("id", id);

  if (error) {
    toast.error("削除に失敗しました");
    return;
  } else {
    return data;
  }
};

export const editIsComplete = async (id: number, isComplete: boolean) => {
  const { error } = await client
    .from("todos")
    .update({ iscomplete: isComplete })
    .eq("id", id);

  if (error) {
    return false;
  } else {
    return true;
  }
};

export const moveTodo = async (
  todos: TodoType[],
  id: number,
  targetIndex: number,
  taskType: TaskType
) => {
  const deadline = taskType == "other" ? null : getDate(taskType);
  if (targetIndex < 0 || todos.length < targetIndex) {
    return false;
  }
  let sortkey = null;
  if (todos.length != 0) {
    if (targetIndex == 0) {
      const first = todos[0];
      sortkey = first.sortkey ? first.sortkey : first.id;
      if (Number.isInteger(sortkey)) {
        sortkey -= 0.5;
      } else {
        sortkey = (sortkey + Math.floor(sortkey)) / 2;
      }
    } else if (targetIndex == todos.length) {
      const last = todos.slice(-1)[0];
      sortkey = last.sortkey ? last.sortkey : last.id;
      if (Number.isInteger(sortkey)) {
        sortkey += 0.5;
      } else {
        sortkey = (sortkey + Math.ceil(sortkey)) / 2;
      }
    } else {
      const a = todos[targetIndex - 1];
      const sortkeyA = a.sortkey ? a.sortkey : a.id;
      const b = todos[targetIndex];
      const sortkeyB = b.sortkey ? b.sortkey : b.id;
      sortkey = (sortkeyA + sortkeyB) / 2;
    }
  }
  const { error } = await client
    .from("todos")
    .update({ sortkey: sortkey, deadline: deadline })
    .eq("id", id);
  if (error) {
    return false;
  } else {
    return true;
  }
};

export const addNewProfile = async (
  uid: string,
  username: string,
  avatar: string
) => {
  const { error } = await client
    .from<ProfileType>("profiles")
    .insert([{ uid: uid, username: username, avatar: avatar }]);
  if (error) {
    return false;
  }
  return true;
};

export const getProfile = async (uid: string) => {
  const { data, error } = await client
    .from<ProfileType>("profiles")
    .select("*")
    .limit(1)
    .single();
  if (error || !data) {
    return null;
  }
  if (data.avatar == "storage") {
    data.avatar = await getAvatarUrl(uid);
  }
  return data;
};

export const updateProfile = async (
  uid: string,
  username: string,
  avatar: string
) => {
  const { error } = await client
    .from("profiles")
    .update({
      username: username,
      avatar: avatar,
    })
    .eq("uid", uid);
  return error ? false : true;
};

export const uploadAvatar = async (uid: string, file: File) => {
  const { error } = await client.storage
    .from("avatars")
    .upload(`avatar_${uid}.jpg`, file, { upsert: true });
  return error ? false : true;
};

const getAvatarUrl = async (uid: string) => {
  const { error, signedURL } = await client.storage
    .from("avatars")
    .createSignedUrl(`avatar_${uid}.jpg`, 3600);
  if (!error && signedURL) {
    return signedURL;
  }
  return "";
};
