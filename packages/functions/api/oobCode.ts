import { NowRequest, NowResponse } from "@vercel/node";
import axios, { AxiosResponse } from "axios";
import * as fs from "fs";
import * as path from "path";

interface TempStore {
  [i: string]: string;
}
interface signInWithEmailLinkCodeResponse {
  email: string;
  expiresIn: string;
  idToken: string;
  isNewUser: boolean;
  kind: "identitytoolkit#EmailLinkSigninResponse";
  localId: string;
  refreshToken: string;
}

const emailLinkSigninView = fs.readFileSync(
  path.join(__dirname, "..", "views", "index.html"),
  "utf-8"
);
const oobCodes: TempStore = {};
const identityKeys: TempStore = {};
export default async (req: NowRequest, res: NowResponse) => {
  if (req.method === "POST" && req.url.includes("/send-email-link")) {
    const email = req.body.email;
    const identityKey = req.body.identityKey;
    if (!email || !identityKey)
      res.status(400).send({ message: "Bad Request" });
    oobCodes[email] = "";
    identityKeys[email] = identityKey;
    const sendEmailRes = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${process.env.FIREBASE_API_KEY}`,
      {
        requestType: "EMAIL_SIGNIN",
        email: email,
        continueUrl: `https://lookahead-api.vercel.app/verify?em=${email}`,
      }
    );
    if (sendEmailRes) res.status(200).send({ message: "OK" });
    else res.status(500).send({ message: "Internal Server Error" });
  }
  if (req.method === "GET" && req.url.includes("/verify")) {
    const urlParams = new URLSearchParams(`?${req.url.split("?")[1]}`);
    const email = urlParams.get("em");
    const oobCode = urlParams.get("oobCode");
    oobCodes[email] = oobCode || "";
    res.status(200).send(emailLinkSigninView);
  }
  if (req.method === "POST" && req.url.includes("/get-login-tokens")) {
    () => {
      // NOOP
      oobCodes;
      identityKeys;
    };
    const email = req.body.email;
    const identityKey = req.body.identityKey;
    const oobCode = oobCodes[email];
    if (identityKeys[email] === identityKey) {
      if (oobCode) {
        try {
          const verifyCodeRes: AxiosResponse<signInWithEmailLinkCodeResponse> = await axios.post(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/emailLinkSignin?key=${process.env.FIREBASE_API_KEY}`,
            { oobCode: oobCode, email: email }
          );
          if (oobCodes[email] !== "") delete oobCodes[email];
          res.send(verifyCodeRes.data);
        } catch (e) {
          console.log(e.response);
        }
      } else {
        res.send({});
      }
    } else res.status(401).send({ message: "Unauthorized" });
  }
};
