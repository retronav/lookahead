import { NowRequest, NowResponse } from "@vercel/node";
import joi from "joi";
import admin from "firebase-admin";
import { getDate } from "../util";
const app = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.GCLOUD_CREDENTIALS, "base64").toString("utf8")
    )
  ),
});
export default async (req: NowRequest, res: NowResponse) => {
  const firestore = app.firestore();
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res.status(401).send({ message: "Unauthorized" });
  }
  const userToken: string = (req.headers.authorization as string).split(
    "Bearer "
  )[1];
  let decodedToken: admin.auth.DecodedIdToken;
  try {
    decodedToken = await app.auth().verifyIdToken(userToken);
    if (decodedToken.uid) {
      console.debug("decoded token present");
    } else {
      console.debug("decoded token not present");
    }
  } catch (e) {
    res.status(403).send({ message: "Permission Denied" });
  }
  switch (req.method) {
    case "GET":
      const todos = [];
      const todoData = await firestore
        .collection(`users/${decodedToken.uid}/todos`)
        .get();
      todoData.docs.forEach((todo) =>
        todos.push({ id: todo.id, data: todo.data() })
      );
      res.send(todos);
      break;

    case "PATCH":
      const patchSchema = joi.object({
        id: joi.string(),
        data: {
          title: joi.string().optional(),
          content: joi.string().allow("", null).optional(),
        },
      });
      try {
        await patchSchema.validateAsync(req.body);
      } catch (e) {
        res.status(400).send(e);
        return;
      }
      try {
        await firestore
          .doc(`users/${decodedToken.uid}/todos/${req.body.id}`)
          .set(
            { ...req.body.data, last_edited: JSON.stringify(getDate()) },
            { merge: true }
          );
        res.status(200).send({ message: "OK" });
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
      }
      break;

    case "DELETE":
      const deleteSchema = joi.object({
        id: joi.string(),
      });
      try {
        await deleteSchema.validateAsync(req.body);
      } catch (e) {
        res.status(400).send(e);
        return;
      }

      try {
        await firestore
          .doc(`users/${decodedToken.uid}/todos/${req.body.id}`)
          .delete();
        res.status(200).send({ message: "OK" });
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
      }
      break;

    case "POST":
      const postSchema = joi.object({
        data: {
          title: joi.string(),
          content: joi.string().allow("", null).optional(),
        },
      });
      try {
        await postSchema.validateAsync(req.body);
      } catch (e) {
        console.error(e);
        res.status(400).send(e);
        return;
      }

      try {
        await firestore
          .collection(`users/${decodedToken.uid}/todos`)
          .add({ ...req.body.data, last_edited: JSON.stringify(getDate()) });
        res.status(200).send({ message: "OK" });
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
      }
      break;
    default:
      res.status(404).send({ message: "Not Found" });
  }
};
