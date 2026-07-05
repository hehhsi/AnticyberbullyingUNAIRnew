const light = document.querySelector(".light");
const noneText = document.getElementById("noneText");

let t = 0;

document.addEventListener("mousemove", e => {
  light.style.left = e.clientX - 150 + "px";
  light.style.top = e.clientY - 150 + "px";
});

function animate() {
  t += 0.03;
  const y = Math.sin(t) * 6;
  noneText.setAttribute(
    "transform",
    `translate(0 ${y})`
  );
  requestAnimationFrame(animate);
}

animate();
