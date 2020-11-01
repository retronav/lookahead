const { exec } = require("child_process");

exec(
  `firebase serve --only hosting:prod -p 3000 ${
    process.env.CI === "true" ? `--token ${process.env.FIREBASE_CI_TOKEN}` : ""
  }`,
  (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
    if (stderr) {
      process.stderr.write(stderr);
    }
    if (stdout && !stdout.includes("hosting:")) {
      process.stdout.write(stdout);
    }
  }
);
