const config = process.env.NEXT_PUBLIC_FIREBASE_APP_CONFIG
  ? //CI
    JSON.parse(
      Buffer.from(
        process.env.NEXT_PUBLIC_FIREBASE_APP_CONFIG,
        "base64"
      ).toString("utf8")
    )
  : //Local
    {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APIKEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_AUTHDOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_DATABASEURL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_PROJECTID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_STORAGEBUCKET,
      messagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGINGSENDERID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APPID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MESAUREMENTID,
    };

export default config;
