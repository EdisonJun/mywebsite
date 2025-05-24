// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

// Token 请勿前端暴露，仅服务端使用
const Token =
  "8166759814d8e1b19ef552378eaf5e2b4b79245cb48f4057c2dd2c5f5e3f88b5d03e406fc87274d19808e2a741e9097a1c3d73e47b67cc91e7b769f920233ab61b1bc6748aa41f629d2c6026d79e599fad9bef240e39cc3c540504fad13ec6d130d195c67fc939e52989d9c733b0d9785632905c9eaab8a96383d7be815bab00";

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
