const { generateSW } = require("workbox-build");
const swDest = "dist/sw.js";
generateSW({
  swDest,
  globDirectory: "dist/",
  globPatterns: ["**/*.{css,html,js,png,ico}"],
}).then(({ count, size }) => {
  console.log(
    `Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`
  );
  process.exit();
});
