// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const upload = multer();
app.use(cors());

// Проверяем, что ключ Gemini есть
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Эндпоинт для решения задания
app.post("/solve", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    const base64Image = req.file.buffer.toString("base64");

    // Генерация ответа через Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype,
        },
      },
      {
        text: "Реши задание на изображении подробно и понятно, пошагово объясни решение.",
      },
    ]);

    const text = result.response.text(); // текст ответа от AI
    res.json({ solution: text });

  } catch (error) {
    console.error("Ошибка AI:", error);
    res.status(500).json({ error: "Ошибка сервера при генерации решения" });
  }
});

const PORT = process.env.PORT || 3000;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Раздаём папку dist
app.use(express.static(path.join(__dirname, "dist")));

// Для всех остальных маршрутов отдаём index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});