import express from "express";
import multer from "multer";
import * as genai from "@google/genai";
import path from "path";
import fs from "fs";

const app = express();

// Папка для временного хранения файлов
const upload = multer({ dest: "uploads/" });

// Обработка POST-запроса с файлом
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "Файл не загружен" });
    }

    const file = req.file;
    const prompt = `Напиши короткий отзыв о файле "${file.originalname}"`;

    // Генерация текста через Google GenAI
    const response = await genai.text.generate({
      model: "models/text-bison-001", // рабочая модель
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 300,
      apiKey: process.env.GOOGLE_API_KEY
    });

    const review = response.output?.[0]?.content || "Нет ответа от AI";

    // Отправляем ответ
    res.send({ review });

    // Удаляем временный файл после обработки
    fs.unlink(path.join(file.path), (err) => {
      if (err) console.error("Ошибка при удалении файла:", err);
    });
  } catch (err) {
    console.error("Ошибка AI:", err);
    res.status(500).send({ error: "Ошибка AI" });
  }
});

// Статические файлы (если нужен фронтенд)
app.use(express.static("public"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));