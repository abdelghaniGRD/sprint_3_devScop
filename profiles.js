const urlParams = new URLSearchParams(window.location.search);

const prevInput = urlParams.get("query");

if (prevInput) {
  console.log(prevInput);
  console.log(document.querySelector(".search"));
  document.querySelector(".search").value = prevInput;
}

const searchBtn = document.querySelector(".searchBtn");
const mainContent = document.querySelector(".mainContent");
searchBtn.addEventListener("click", () => {});
