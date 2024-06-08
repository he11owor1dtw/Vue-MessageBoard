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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});