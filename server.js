const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
// const { GoogleGenerativeAI } = require("@google/generative-ai"); // раскомментировать для реального AI

const app = express();
const upload = multer();
app.use(cors());

// Для теста возвращаем фиксированный ответ
app.post("/solve", upload.single("image"), async (req, res) => {
  try {
    // Временно вместо Gemini API
    res.json({
      solution: "✅ Тестовое решение задания будет здесь. Всё работает!"
    });

    // Для реального AI раскомментировать и использовать:
    /*
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const base64Image = req.file.buffer.toString("base64");
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
      { text: "Реши задание на изображении подробно и понятно." }
    ]);
    res.json({ solution: result.response.text() });
    */
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Раздача фронтенда
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));