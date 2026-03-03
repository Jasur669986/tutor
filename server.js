import express from "express";
import multer from "multer";
import path from "path";
import * as genai from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads/" });

// создаём клиент один раз
const client = new genai.Client({
  apiKey: process.env.GOOGLE_API_KEY
});

// чтобы отдавать простую HTML-страницу
app.get("/", (req, res) => {
  res.send(`
    <h2>Загрузите файл для генерации AI-отзыва</h2>
    <form method="post" enctype="multipart/form-data" action="/upload">
      <input type="file" name="file" required />
      <button type="submit">Отправить</button>
    </form>
  `);
});

// эндпоинт для загрузки файла и генерации отзыва
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("Файл не загружен");
    }

    const prompt = Напиши короткий отзыв о файле ${file.originalname};

    // генерация текста через GenAI
    const response = await client.models.generateText({
      model: "text-bison-001",  // рабочая модель
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 300
    });

    const review = response.output[0].content;

    res.send(`
      <h3>Отзыв AI о файле "${file.originalname}"</h3>
      <p>${review}</p>
      <a href="/">Вернуться</a>
    `);
  } catch (err) {
    console.error("Ошибка AI:", err);
    res.status(500).send("Ошибка AI");
  }
});

// слушаем порт Render или локально
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));