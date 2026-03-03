import express from "express";
import multer from "multer";
import * as genai from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads/" });

// главная страница с формой
app.get("/", (req, res) => {
  res.send(`
    <h2>Загрузите файл для AI-отзыва</h2>
    <form method="post" enctype="multipart/form-data" action="/upload">
      <input type="file" name="file" required />
      <button type="submit">Отправить</button>
    </form>
  `);
});

// загрузка файла и генерация текста
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("Файл не загружен");

    const prompt = `Напиши короткий отзыв о файле ${file.originalname}`;

    // вызов генерации напрямую через genai.text.generate
    const response = await genai.text.generate({
      model: "text-bison-001", // рабочая модель
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 300,
      apiKey: process.env.GOOGLE_API_KEY // ключ из Render
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));