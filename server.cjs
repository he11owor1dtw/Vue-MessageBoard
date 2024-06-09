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
    comments.set(page.id, {
      id: page.id,
      user: page.properties.user.rich_text[0].text.content,
      time: getRelativeTimeDesc(page.properties.time.created_time),
      content: page.properties.content.rich_text[0].text.content,
      avatar: page.properties.avatar.url,
      replies: page.properties.replies.relation,
      replyTo: page.properties.replyTo?.relation[0]?.id,
    });
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

app.get("/comments", async (req, res) => {
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

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