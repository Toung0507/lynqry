const params = new URLSearchParams(location.search);
const type = params.get("type") || "star";
const tableBody = document.getElementById("tableBody");
const search = document.getElementById("search");
const count = document.getElementById("count");
const title = document.getElementById("title");
let questions = [];
let jsonFile = "";
if (type === "earth") {
  jsonFile = "json/earth.json";
  title.textContent = "🌍 地球超新鮮 題庫";
  document.getElementById("earthTab").classList.add("active");
}
else if (type === "star") {
  jsonFile = "json/star.json";
  title.textContent = "灿如繁星 題庫";
  document.getElementById("starTab").classList.add("active");
}
else {
  jsonFile = "json/entertainment.json";
  title.textContent = "🎭 內娛 題庫";
  document.getElementById("entertainmentTab").classList.add("active");
}

async function load() {
  const response = await fetch(jsonFile);
  questions = await response.json();
  render(questions);
}

function render(data) {
  tableBody.innerHTML = "";
  count.textContent = `共 ${data.length} 題`;
  if (data.length === 0) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="3" class="no-data">
                查無資料
            </td>
        </tr>
        `;
    return;
  }

  data.forEach(item => {
    tableBody.innerHTML += `
        <tr>
            <td>${item.id}</td>
            <td>${item.question}</td>
            <td>${item.answer}</td>
        </tr>
        `;
  });
}

search.addEventListener("input", () => {
  const keyword = search.value.trim().toLowerCase();
  if (keyword === "") {
    render(questions);
    return;
  }

  const result = questions.filter(item => {
    return (
      item.question.toLowerCase().includes(keyword)
      ||
      item.answer.toLowerCase().includes(keyword)
    );
  });
  render(result);
});

load();