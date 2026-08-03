// =================================
// 初始化設定
// =================================

const params = new URLSearchParams(location.search);

const defaultType = "zhejiang_TV";
const type = params.get("type") || defaultType;

// =================================
// DOM 元素
// =================================

const tableHeader = document.getElementById("tableHeader");
const tableBody = document.getElementById("tableBody");
const search = document.getElementById("search");
const count = document.getElementById("count");
const title = document.getElementById("title");
const themeToggle = document.getElementById("themeToggle");

// =================================
// 全域狀態
// =================================

let questions = [];
let timer = null;

let currentType = type;
let currentTable;


// =================================
// 題庫資料設定
// =================================

const pages = {

  lyn: {
    file: "json/lyn.json",
    title: "劉宇寧專項小考"
  },

  zhejiang_TV: {
    file: "json/zhejiang_TV.json",
    title: "浙江衛視音綜"
  },

  new_star: {
    file: "json/new_star.json",
    title: "新「星」 題庫"
  },

  singer2026: {
    file: "json/singer2026.json",
    title: "歌手2026 題庫"
  },

  entertainment: {
    file: "json/entertainment.json",
    title: "🎭 內娛 題庫"
  },

  hun: {
    file: "json/hun.json",
    title: "百花殺"
  },

  dog: {
    file: "json/dog.json",
    title: "野狗骨頭"
  },

  chicken: {
    file: "json/chicken.json",
    title: "肯德基"
  },

  reasoning: {
    file: "json/reasoning.json",
    title: "開始推理吧 題庫"
  },

  star: {
    file: "json/star.json",
    title: "灿如繁星 題庫"
  },

  earth: {
    file: "json/earth.json",
    title: "🌍 地球超新鮮 題庫"
  }

};


// =================================
// 表格設定
// =================================

const defaultTable = {
  headers: [
    "序號",
    "題目",
    "答案"
  ],
  fields: [
    "question",
    "answer"
  ]
};

const tableConfig = {
  new_star: {
    headers: [
      "序號",
      "出題者",
      "題目",
      "答案"
    ],
    fields: [
      "creator",
      "question",
      "answer"
    ]
  }
};

// =================================
// 夜間模式
// =================================

// 初始化夜間模式 icon
function initTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
}

// 切換日夜模式
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  themeToggle.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem(
    "theme",
    dark ? "dark" : "light"
  );
}

// =================================
// 表格功能
// =================================

// 建立表頭
function setupTable() {
  tableHeader.innerHTML = "";

  currentTable.headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    tableHeader.appendChild(th);
  });
}

// 渲染題目資料
function render(data) {
  count.textContent = `共 ${data.length} 題`;
  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="${currentTable.headers.length}" class="no-data">
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
    let html = `<td>${index + 1}</td>`;
    currentTable.fields.forEach(field => {
      html += `<td>${item[field] ?? ""}</td>`;
    });
    tr.innerHTML = html;
    fragment.appendChild(tr);
  });
  tableBody.appendChild(fragment);
}

// =================================
// 搜尋功能
// =================================

// 搜尋題目
function handleSearch() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const keywords =
      search.value
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    if (!keywords.length) {
      render(questions);
      return;
    }
    const result =
      questions.filter(item =>
        keywords.every(keyword =>
          item.search.includes(keyword)
        )
      );

    render(result);
  }, 150);
}

// =================================
// 鍵盤快捷鍵
// =================================

function handleKeyboard(e) {
  // Ctrl + F 搜尋
  if (
    (e.ctrlKey || e.metaKey)
    &&
    e.key.toLowerCase() === "f"
  ) {
    e.preventDefault();
    search.focus();
    search.select();
    return;
  }

  // / 快速搜尋

  if (e.key === "/"
    && document.activeElement.tagName !== "INPUT"
    && document.activeElement.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    search.focus();
  }
}

// =================================
// SPA 切換頁面
// =================================

// 切換題庫
async function changePage(newType) {
  if (!pages[newType]) return;
  currentType = newType;
  const pageData = pages[newType];
  currentTable = tableConfig[newType] || defaultTable;

  // 清空搜尋框
  search.value = "";

  // 更新標題
  title.textContent = pageData.title;

  // 更新 tab 狀態
  document
    .querySelectorAll(".tab")
    .forEach(tab => {
      tab.classList.remove("active");
    });

  document
    .querySelector(
      `[data-type="${newType}"]`
    )
    ?.classList.add("active");

  // 更新表格
  setupTable();

  // 載入 JSON
  const response = await fetch(pageData.file);
  const data = await response.json();
  questions =
    data.map(item => ({
      ...item,
      search:
        Object.values(item)
          .join(" ")
          .toLowerCase()

    }));
  render(questions);

  // 更新網址但不重新整理
  history.pushState(
    null,
    "",
    `?type=${newType}`
  );
}

// =================================
// 初始化事件
// =================================

// tab 點擊

document
  .querySelectorAll(".tab")
  .forEach(tab => {
    tab.addEventListener(
      "click",
      e => {
        e.preventDefault();
        changePage(
          tab.dataset.type
        );
      }
    );
  });

// 搜尋
search.addEventListener(
  "input",
  handleSearch
);

// 快捷鍵
document.addEventListener(
  "keydown",
  handleKeyboard
);

// 夜間模式
themeToggle.addEventListener(
  "click",
  toggleTheme
);

// =================================
// 啟動
// =================================

initTheme();
changePage(type);