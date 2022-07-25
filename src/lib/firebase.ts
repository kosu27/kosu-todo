import { initializeApp } from "firebase/app";
import "firebase/app";
import "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { getDate, TaskType } from "src/lib/Datetime";
import { FC, useEffect, useState } from "react";

// interface PROPS {
//   id: string;
//   title: string;
// }

// const [tasks, setTasks] = useState([{ id: "", title: "" }]);
// const [input, setInput] = useState("");

export const firebaseApp = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export type TodoType = {
  id: number;
  uid: string;
  inserted: Date;
  task: string;
  deadline: Date | null;
  iscomplete: boolean;
  sortkey: number | null;
};

// useEffect(() => {
//   //Firebase ver9 compliant (modular)
//   const q = query(collection(db, "tasks"));
//   const unsub = onSnapshot(q, (querySnapshot) => {
//     setTasks(
//       querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         title: doc.data().title,
//       }))
//     );
//   });
//   return () => unsub();
// }, []);

// export const newTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
//   //Firebase ver9 compliant (modular)
//   await addDoc(collection(db, "tasks"), { title: input });
//   setInput("");
// };

// export const TaskItem: FC<PROPS> = (props) => {
//     const [title, setTitle] = useState(props.title);
//     //Firebase ver9 compliant (modular)
//     const tasksRef = collection(db, "todos");
//     const editTask = async () => {
//         //Firebase ver9 compliant (modular)
//         await setDoc(
//             doc(tasksRef, props.id),
//             {
//                 title: title,
//             },
//             { merge: true }
//         );
//     };

//     const deleteTask = async () => {
//         //Firebase ver9 compliant (modular)
//         await deleteDoc(doc(tasksRef, props.id));
//     };
// }

const app = initializeApp(firebaseApp);
export const db = getFirestore(app);
