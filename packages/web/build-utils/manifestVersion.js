const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");
const manifestJSON = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "dist", "manifest.json"))
);

manifestJSON.version = pkg.version;

fs.writeFileSync(
  path.join(process.cwd(), "dist", "manifest.json"),
  JSON.stringify(manifestJSON)
);

console.log("manifest.json version updated");
