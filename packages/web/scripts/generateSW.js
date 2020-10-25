const { generateSW } = require("workbox-build");
const swDest = "out/sw.js";
generateSW({
  swDest,
  globDirectory: "out/",
  globPatterns: ["**/*.{css,html,js,png,ico,webm}"],
}).then(({ count, size }) => {
  console.log(
    `Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`
  );
  process.exit();
});
