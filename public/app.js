const btn = document.getElementById("ping");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {
  result.classList.add("loading");
  result.textContent = "// contacting /api/hello …";
  try {
    const res = await fetch("/api/hello");
    const data = await res.json();
    // Cute micro animation
    result.animate([{ transform: "scale(0.98)" }, { transform: "scale(1)" }], { duration: 180, easing: "ease-out" });
    result.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    result.textContent = `// error: ${e?.message || e}`;
  } finally {
    result.classList.remove("loading");
  }
});
