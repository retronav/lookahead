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
import Todo from "../Todo/Todo";
import TodoSkeleton from "./TodoSkeleton";
import Helmet from "react-helmet";
import { LoaderContext } from "../Navbar/Loader";
import CreateTodo from "../Todo/CreateTodo";

interface TodoData {
  title: string;
  content: string;
  id: string;
}

export default () => {
  const [collection, setCollection] = useState<TodoData[] | null>(null);
  const [fetchedData, setFetchedData] = useState(false);
  const [dialogState, setDialogState] = useState({
    open: false,
    key: "",
  });
  const [createNewDialogState, setNewDialogState] = useState(false);
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
      if (location.hostname === "localhost") {
        firestore.settings({
          host: "localhost:8000",
          ssl: false,
        });
      }
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
  return (
    <>
      <Helmet>
        <title>Lookahead App</title>
      </Helmet>
      <CreateTodo firestore={firestoreHook} />
      <br />
      <br />
      <Grid container>
        {dialogState.open && (
          <EditTodo
            firestore={firestoreHook}
            dialogState={dialogState}
            handleClose={() => setDialogState({ open: false, key: "" })}
          />
        )}
        {/* {createNewDialogState && (
          <NewTodoDialog
            firestore={firestoreHook}
            dialogState={createNewDialogState}
            handleClose={() => setNewDialogState(false)}
          />
        )} */}
        {collection ? (
          collection.map((doc) => (
            <Todo
              handles={{
                open: (key) => setDialogState({ open: true, key: key }),
                close: () => setDialogState({ open: false, key: "" }),
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
