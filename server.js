// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import * as genai from "@google/genai";

const app = express();
const PORT = process.env.PORT || 10000;

// Настройка CORS
app.use(cors());
app.use(express.json());

// Настройка multer для загрузки файлов
const upload = multer({ dest: "uploads/" });

// Инициализация клиента GenAI
const client = new genai.Client({
  apiKey: process.env.GOOGLE_API_KEY
});

// Эндпоинт для теста
app.get("/", (req, res) => {
  res.send("Сервер работает! Загрузка файлов доступна на /upload");
});

// Эндпоинт для загрузки файлов и генерации AI ответа
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Файл не найден" });

    // Здесь можно читать файл и формировать prompt, для примера простой текст:
    const prompt = `Напиши короткий отзыв о файле ${file.originalname}`;

    const response = await client.responses.create({
      model: "models/text-bison-001", // рабочая текстовая модель
      input: prompt,
    });

    // Берём текст из ответа AI
    const aiText = response.output[0]?.content[0]?.text || "Нет ответа от AI";

    res.json({
      filename: file.originalname,
      solution: aiText,
    });
  } catch (err) {
    console.error("Ошибка AI:", err);
    res.status(500).json({ error: "Ошибка AI", details: err });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});