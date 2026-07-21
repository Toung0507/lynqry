const jsonFile = "../json/entertainment.json";

/* =========================
   自訂關鍵詞
========================= */

const customKeywords = [
  "以下哪部",
  "以下哪個",
  "以下哪句",
  "以下哪位",
  "以下哪首",
  "以下哪項",
  "冠軍",
  "顏色",
  "歌曲",
  "演唱",
  "職業",
  "武器",
  "生日",
  "主角",
  "角色",
  "真實身分"
];


/* =========================
   取得 HTML 元素
========================= */

const workSelect = document.getElementById("workThreshold");
const keywordSelect = document.getElementById("keywordThreshold");

const workList = document.getElementById("workList");
const keywordList = document.getElementById("keywordList");

const workCount = document.getElementById("workCount");
const keywordCount = document.getElementById("keywordCount");

const workQuestionTitle =
  document.getElementById("workQuestionTitle");

const workQuestionList =
  document.getElementById("workQuestionList");

const keywordQuestionTitle =
  document.getElementById("keywordQuestionTitle");

const keywordQuestionList =
  document.getElementById("keywordQuestionList");


let questions = [];


/* =========================
   載入 JSON
========================= */

async function loadQuestions() {

  try {

    const response = await fetch(jsonFile);

    if (!response.ok) {
      throw new Error("JSON 載入失敗");
    }

    questions = await response.json();

    renderWorks();
    renderKeywords();

  } catch (error) {

    console.error(error);

    workList.innerHTML = "<p>題庫載入失敗</p>";
    keywordList.innerHTML = "<p>題庫載入失敗</p>";

  }

}


/* =========================
   取得作品名稱
========================= */

function getWorks(question) {

  const matches = question.match(/《([^》]+)》/g);

  if (!matches) {
    return [];
  }

  return matches.map(work =>
    work.slice(1, -1)
  );

}


/* =========================
   統計作品名稱
========================= */

function analyzeWorks() {

  const workCount = {};

  questions.forEach(item => {

    const works = getWorks(item.question);

    works.forEach(work => {

      workCount[work] =
        (workCount[work] || 0) + 1;

    });

  });

  return workCount;

}


/* =========================
   統計自訂關鍵詞
========================= */

function analyzeKeywords() {

  const keywordCount = {};

  customKeywords.forEach(keyword => {

    keywordCount[keyword] = 0;

  });


  questions.forEach(item => {

    customKeywords.forEach(keyword => {

      if (item.question.includes(keyword)) {

        keywordCount[keyword]++;

      }

    });

  });


  return keywordCount;

}


/* =========================
   顯示作品名稱
========================= */

function renderWorks() {

  const minCount =
    Number(workSelect.value);

  const works =
    analyzeWorks();


  const result =
    Object.entries(works)
      .filter(([work, count]) =>
        count >= minCount
      )
      .sort((a, b) =>
        b[1] - a[1]
      );


  workList.innerHTML = "";

  workCount.textContent =
    `作品名稱（${result.length} 個）`;


  if (result.length === 0) {

    workList.innerHTML =
      "<p>沒有符合條件的作品名稱</p>";

    return;

  }


  result.forEach(([work, count]) => {

    const button =
      document.createElement("button");


    button.className =
      "keyword-item";


    button.innerHTML = `
      <span>${work}</span>
      <span>${count} 次</span>
    `;


    button.addEventListener("click", () => {

      showWorkQuestions(work);

    });


    workList.appendChild(button);

  });

}


/* =========================
   顯示關鍵詞
========================= */

function renderKeywords() {

  const minCount =
    Number(keywordSelect.value);

  const keywords =
    analyzeKeywords();


  const result =
    Object.entries(keywords)
      .filter(([keyword, count]) =>
        count >= minCount
      )
      .sort((a, b) =>
        b[1] - a[1]
      );


  keywordList.innerHTML = "";

  keywordCount.textContent =
    `關鍵詞（${result.length} 個）`;


  if (result.length === 0) {

    keywordList.innerHTML =
      "<p>沒有符合條件的關鍵詞</p>";

    return;

  }


  result.forEach(([keyword, count]) => {

    const button =
      document.createElement("button");


    button.className =
      "keyword-item";


    button.innerHTML = `
      <span>${keyword}</span>
      <span>${count} 次</span>
    `;


    button.addEventListener("click", () => {

      showKeywordQuestions(keyword);

    });


    keywordList.appendChild(button);

  });

}


/* =========================
   顯示作品相關題目
========================= */

function showWorkQuestions(work) {

  const result =
    questions.filter(item =>
      item.question.includes(`《${work}》`)
    );


  workQuestionTitle.textContent =
    `「${work}」相關題目（${result.length} 題）`;


  workQuestionList.innerHTML = "";


  if (result.length === 0) {

    workQuestionList.innerHTML =
      "<p>查無相關題目</p>";

    return;

  }


  result.forEach((item, index) => {

    const questionItem =
      document.createElement("div");


    questionItem.className =
      "question-item";


    questionItem.innerHTML = `
      <p>
        <strong>
          ${index + 1}. ${item.question}
        </strong>
      </p>

      <p>
        答案：
        <span>${item.answer}</span>
      </p>
    `;


    workQuestionList.appendChild(questionItem);

  });


  scrollToElement(workQuestionTitle);

}


/* =========================
   顯示關鍵詞相關題目
========================= */

function showKeywordQuestions(keyword) {

  const result =
    questions.filter(item =>
      item.question.includes(keyword)
    );


  keywordQuestionTitle.textContent =
    `「${keyword}」相關題目（${result.length} 題）`;


  keywordQuestionList.innerHTML = "";


  if (result.length === 0) {

    keywordQuestionList.innerHTML =
      "<p>查無相關題目</p>";

    return;

  }


  result.forEach((item, index) => {

    const questionItem =
      document.createElement("div");


    questionItem.className =
      "question-item";


    questionItem.innerHTML = `
      <p>
        <strong>
          ${index + 1}. ${item.question}
        </strong>
      </p>

      <p>
        答案：
        <span>${item.answer}</span>
      </p>
    `;


    keywordQuestionList.appendChild(questionItem);

  });


  scrollToElement(keywordQuestionTitle);

}


/* =========================
   滾動到結果
========================= */

function scrollToElement(element) {

  element.scrollIntoView({

    behavior: "smooth",

    block: "start"

  });

}


/* =========================
   下拉選單
========================= */

workSelect.addEventListener(
  "change",
  renderWorks
);


keywordSelect.addEventListener(
  "change",
  renderKeywords
);


/* =========================
   啟動
========================= */

loadQuestions();