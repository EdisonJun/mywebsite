// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

// Token 请勿前端暴露，仅服务端使用
const Token =
  "daf95a6223078366798bc9346eade59a7a07fc6b86110910597e327bd834ce8025ee5559887d88b4541551ef3b54cbc4ada7cae630e08953a68bd082a938cf7fb649e7457c95a5249eb9051f422f7cb486637b6689f53767eb7f9e0b475deefce2eaf9d4e4742c6252a1153cb86f73146de795261ae963dd19513c8d692c303a";

app.use(cors()); // 允许跨域请求

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);

// 获取技能列表
app.get("/skills", async (req, res) => {
  try {
    const response = await fetch(
      "http://localhost:1337/api/skills?populate=image",
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
    res.status(500).json({ error: "Failed to fetch from Strapi" });
  }
});

// 获取文章列表
app.get("/articles", async (req, res) => {
  try {
    const response = await fetch("http://localhost:1337/api/articles", {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Strapi response error:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch articles:", err.message);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const response = await fetch(
      "http://localhost:1337/api/projects?sort=publishedAt:desc&populate=*",
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Strapi response error:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch articles:", err.message);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at ${PORT}`);
});
