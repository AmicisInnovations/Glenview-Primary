document.addEventListener("DOMContentLoaded", () => {
  const lm1 = document.getElementById("learn1");
  lm1.addEventListener("click", () => {
    alert("click click");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const lm2 = document.getElementById("learn2");
  lm2.addEventListener("click", () => {
    alert("click click");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navLogo = document.getElementById("nav-logo");
  navLogo.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
