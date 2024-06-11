const { Client } = require("@notionhq/client");
require("dotenv").config();
// 會直接讀取 .env 文件，並把裡面的鍵值對放到環境變量中

const express = require("express");
const app = express();
app.use(express.json());
// 給 express 加上 json() 插件，把接收到的 HTTP 請求 BODY，從 JSON 轉換爲 JS 對象
const port = 3001;

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NOTION_CURR_USER_ID = process.env.NOTION_CURR_USER_ID;
// 從環境變量中獲取 Notion API Key 、數據庫 id 和 當前用戶 id

const notion = new Client({ auth: NOTION_KEY });
// 初始化 Notion client，把 notion api key 傳遞給它的配置對象的 auth 屬性

async function getAllComments() {
  const result = await notion.databases.query({ database_id: NOTION_DB_ID });
  const comments = new Map();
  // 原始評論數據
  result?.results?.forEach((page) => {
    comments.set(page.id, transformPageObject(page));
  });

  // 組裝回覆，把關係 id 替換爲實際評論
  let commentsPopulated = [...comments.values()].reduce((acc, curr) => {
    if (!curr.replyTo) {
      curr.replies = curr.replies.map((reply) => comments.get(reply.id));
      acc.push(curr);
    }
    return acc;
  }, []);

  return commentsPopulated;
}

async function addComment({ content, replyTo = "" }) {
  let no =
    (await notion.databases.query({ database_id: NOTION_DB_ID })).results
      .length + 1;
  // 獲取序號，在 Notion 的 database 中，把標題改成了序號(no)，
  // 用 Notion Client 獲取了現有的留言數量，在此基礎上加 1

  let { avatar_url, name } = await notion.users.retrieve({
    user_id: NOTION_CURR_USER_ID,
  });
  // 通過 notion client 的 user api，獲取用戶名和頭像，把環境變量中，保存的當前用戶 ID 傳遞進去，
  // 再把返回結果中的 avatar_url 和 name 屬性解構出來

  const page = await notion.request({
    method: "POST",
    path: "pages",
    body: {
      parent: { database_id: NOTION_DB_ID },
      // parent 設置數據庫的 id，指定在哪個數據庫中添加頁面
      properties: {
        no: {
          title: [
            {
              text: {
                content: no.toString(),
              },
            },
          ],
        },
        // no 為頁面標題，title 類型，也是個富文本，傳遞一個陣列，
        // 陣列的第一個元素爲 text 對象，content 屬性值爲之前獲取到的序號
        user: {
          rich_text: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        // user 是富文本類型，傳遞一個陣列，設置屬性值爲當前用戶的用戶名
        avatar: {
          url: avatar_url,
        },
        // avatar 是 url 類型，設置它的 url 屬性爲當前用戶的頭像 url
        content: {
          rich_text: [
            {
              text: {
                content,
              },
            },
          ],
        },
        // content 富文本類型，設置留言內容

        // 如果有 replyTO 參數傳遞進來的，再添加到請求 body 中
        // 利用擴展運算符，可以在有 replyTo 屬性的時候，把後面的對象解構出來，放到父對象中，
        // 如果沒有就不會解構出任何東西來，適合在創建對象字面值的時候，根據條件添加屬性
        ...(replyTo && {
          replyTo: {
            relation: [
              {
                id: replyTo,
              },
            ],
          },
        }),
      },
    },
  });

  return transformPageObject(page);
}

// 部屬到 vercel 後，請求路徑須加上 /api 前綴
app.get("/comments", async (req, res) => {
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/comments", async (req, res) => {
  try {
    const newPage = await addComment(req.body);
    res.status(201).json(newPage);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.js
function transformPageObject(page) {
  return {
    id: page.id,
    user: page.properties.user.rich_text[0].text.content,
    time: getRelativeTimeDesc(page.properties.time.created_time),
    content: page.properties.content.rich_text[0].text.content,
    avatar: page.properties.avatar.url,
    replies: page.properties.replies.relation,
    replyTo: page.properties.replyTo?.relation[0]?.id,
  };
}

function getRelativeTimeDesc(time) {
  const currentInMs = new Date().getTime();
  const timeInMs = new Date(time).getTime();

  // 定義了一些秒、分鐘、小時、月份、年份所對應的毫秒數
  const minuteInMs = 60 * 1000;
  const hourInMs = 60 * minuteInMs;
  const dayInMs = 24 * hourInMs;
  const monthInMs = 30 * dayInMs;
  const yearInMs = 365 * dayInMs;

  // 通過計算當前時間和傳遞進來的時間的時間戳差值，與上邊定義的毫秒數對比
  // 落在哪個區間，就使用對應的描述，例如差值大於等於月的毫秒數，小於等於年的毫秒數，就計算它有幾個月，顯示幾個月前
  const relativeTime = currentInMs - timeInMs;
  if (relativeTime < minuteInMs) {
    return `${Math.ceil(relativeTime / 1000)} 秒前`;
  } else if (relativeTime < hourInMs) {
    return `${Math.ceil(relativeTime / minuteInMs)} 分鐘前`;
  } else if (relativeTime < dayInMs) {
    return `${Math.ceil(relativeTime / hourInMs)} 小時前`;
  } else if (relativeTime < monthInMs) {
    return `${Math.ceil(relativeTime / dayInMs)} 天前`;
  } else if (relativeTime < yearInMs) {
    return `${Math.ceil(relativeTime / monthInMs)} 月前`;
  } else {
    return `${Math.ceil(relativeTime / yearInMs)} 年前`;
  }
}

module.exports = app;