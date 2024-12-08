function updatePage() {
  console.log("updatePage");
  let fileDate = window.location.href.slice(-9, -5);
  let curDate = new Date()
    .toLocaleDateString("en", { month: "2-digit", day: "2-digit" })
    .replace("/", "");
  if (fileDate != curDate) {
    window.location.href = "../" + curDate + "/" + curDate + ".html";
  }
}
function myHead() {
  let fileMonth = window.location.href.slice(-9, -7);
  let fileDay = window.location.href.slice(-7, -5);
  headDate = new Date(new Date().getFullYear(), fileMonth - 1, fileDay);
  document.title = headDate.toLocaleDateString("ru", {
    day: "numeric",
    month: "long",
  });
  document.getElementById("myHead").textContent = headDate
    .toLocaleDateString("ru", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace("г.", "года");
  document.querySelector('link[rel="icon"]').href =
    "../Styles/" + fileMonth + ".ico";
}
function nextPage() {
  let nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  console.log("next day: " + nextDay);
  let delay = nextDay - Date.now() + 60 * 1000;
  setTimeout(updatePage, delay);
}
function toolTip() {
  document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll("[title]")
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl, { html: true });
    });
  });
}
