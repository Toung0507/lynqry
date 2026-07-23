const params = new URLSearchParams(location.search);
const type = params.get("type") || "dog";

const tableBody = document.getElementById("tableBody");
const search = document.getElementById("search");
const count = document.getElementById("count");
const title = document.getElementById("title");

let questions = [];
let timer = null;

let jsonFile = "";

switch (type) {
  case "dog":
    jsonFile = "json/dog.json";
    title.textContent = "野狗骨頭 題庫";
    document.getElementById("dogTab").classList.add("active");
    break;
  case "chicken":
    jsonFile = "json/chicken.json";
    title.textContent = "肯德基 題庫";
    document.getElementById("chickenTab").classList.add("active");
    break;

  case "reasoning":
    jsonFile = "json/reasoning.json";
    title.textContent = "開始推理吧 題庫";
    document.getElementById("reasoningTab").classList.add("active");
    break;

  case "earth":
    jsonFile = "json/earth.json";
    title.textContent = "🌍 地球超新鮮 題庫";
    document.getElementById("earthTab").classList.add("active");
    break;

  case "star":
    jsonFile = "json/star.json";
    title.textContent = "灿如繁星 題庫";
    document.getElementById("starTab").classList.add("active");
    break;

  case "hun":
    jsonFile = "json/hun.json";
    title.textContent = "百花殺 題庫";
    document.getElementById("hunTab").classList.add("active");
    break;

  default:
    jsonFile = "json/entertainment.json";
    title.textContent = "🎭 內娛 題庫";
    document.getElementById("entertainmentTab").classList.add("active");
}

async function load() {
  const response = await fetch(jsonFile);

  const data = await response.json();

  // 建立搜尋索引，只做一次
  questions = data.map(item => ({
    ...item,
    search: `${item.question} ${item.answer}`.toLowerCase()
  }));

  render(questions);
}

function render(data) {

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

  tableBody.innerHTML = "";

  const fragment = document.createDocumentFragment();

  data.forEach((item, index) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.question}</td>
      <td>${item.answer}</td>
    `;

    fragment.appendChild(tr);

  });

  tableBody.appendChild(fragment);

}


// debounce 搜尋
search.addEventListener("input", () => {

  clearTimeout(timer);

  timer = setTimeout(() => {

    const keywords = search.value
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (keywords.length === 0) {

      render(questions);

      return;

    }


    const result =
      questions.filter(item => {

        const text = `

        ${item.question}

        ${item.answer}

      `.toLowerCase();


        return keywords.every(keyword =>

          text.includes(keyword)

        );

      });

    render(result);

  }, 150);

});

load();

document.addEventListener("keydown", (e) => {

  // Ctrl+F / Cmd+F
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {

    e.preventDefault();
    search.focus();
    search.select();
    return;
  }

  // 按 /
  if (
    e.key === "/" &&
    document.activeElement.tagName !== "INPUT" &&
    document.activeElement.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    search.focus();
  }

});