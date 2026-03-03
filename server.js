const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const upload = multer();

app.use(cors());

// ✅ Проверка наличия API ключа
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/solve", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype,
        },
      },
      {
        text: "Реши задание на изображении подробно и понятно.",
      },
    ]);

    const text = result.response.text();
    res.json({ solution: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});