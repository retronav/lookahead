const myConfetti = confetti.create(document.querySelector("#confetti"), {
  resize: true,
  useWorker: true,
});

document.querySelector(".celebrate").addEventListener("click", () => {
  myConfetti({
    particleCount: 100,
    spread: 160,
  });
});

document.querySelector("button.celebrate").click();
