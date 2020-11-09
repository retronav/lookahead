import { Grid } from "@material-ui/core";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";
// import AddTodo from "../Todo/AddTodo";
import {
  authServices,
  firestore as firestoreModule,
} from "../Firebase/services";
import EditTodo from "../Todo/EditTodo";
// import NewTodoDialog from "../Todo/NewTodoDialog";
import Head from "next/head";
import Todo from "../Todo/Todo";
import TodoSkeleton from "./TodoSkeleton";
import { LoaderContext } from "../Navbar/Loader";
import CreateTodo from "../Todo/CreateTodo";

export interface TodoData {
  title: string;
  content: string;
  id: string;
  last_edited: string;
}
declare global {
  interface Window {
    __activeTodo: TodoData;
  }
}
const Application = () => {
  const [collection, setCollection] = useState<TodoData[] | null>(null);
  const [fetchedData, setFetchedData] = useState(false);
  const [dialogState, setDialogState] = useState({
    open: false,
    key: "",
    data: null,
  });
  const [
    firestoreHook,
    setFirestore,
  ] = useState<firebase.firestore.Firestore | null>(null);
  const { useAuth } = authServices();
  const currentUser = useAuth();
  const loader = React.useContext(LoaderContext);
  useEffect(() => {
    (async () => {
      await firestoreModule;
      const firestore = firebase.firestore();
      // if (location.hostname === "localhost") {
      //   firestore.settings({
      //     host: "localhost:8000",
      //     ssl: false,
      //   });
      // }
      setFirestore(firestore);
      try {
        await firestore.enablePersistence({ synchronizeTabs: true });
      } catch (e) {
        if (e.code !== "failed-precondition") throw e;
      }
      if (currentUser) {
        const newCollection = (await firestore
          ?.doc(`users/${currentUser?.uid}`)
          .collection("todos")
          .get()) as firebase.firestore.QuerySnapshot<TodoData>;
        setFetchedData(true);
        const data: TodoData[] = [];
        if (newCollection && !newCollection?.empty) {
          newCollection.docs.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id });
          });
          setCollection(data);
          firestore
            ?.doc(`users/${currentUser?.uid}`)
            .collection("todos")
            .onSnapshot({ includeMetadataChanges: true }, (snap) => {
              const newCollection: TodoData[] = [];
              snap.docs.forEach((doc) => {
                const data = doc.data() as TodoData;
                newCollection.push({ ...data, id: doc.id });
              });
              setCollection(newCollection);
            });
        }
      }
      // If we don't do this, loader won't show up
      if (navigator.userAgent !== "ReactSnap") loader.stop();
    })();
  }, []);

  const openTodoDialog = (key: string) => {
    setDialogState({
      open: true,
      key: key,
      data: collection.find((doc) => doc.id == key),
    });
  };
  const closeTodoDialog = () => {
    setDialogState({ open: false, key: "", data: null });
  };
  return (
    <>
      <Head>
        <title>Lookahead App</title>
      </Head>
      <CreateTodo firestore={firestoreHook} />
      <br />
      <br />
      <Grid container>
        {dialogState.open && (
          <EditTodo
            firestore={firestoreHook}
            dialogState={dialogState}
            handleClose={closeTodoDialog}
          />
        )}
        {collection ? (
          collection.map((doc) => (
            <Todo
              handles={{
                open: openTodoDialog,
                close: closeTodoDialog,
              }}
              id={doc.id}
              key={doc.id}
              title={doc.title}
              content={doc.content}
            />
          ))
        ) : fetchedData ? (
          <></>
        ) : (
          <TodoSkeleton />
        )}
      </Grid>
    </>
  );
};

export default Application;
