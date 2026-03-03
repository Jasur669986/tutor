import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();
app.use(cors());

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// === РЕШЕНИЕ ЗАДАНИЯ ===
app.post("/solve", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    const base64Image = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-002",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
            {
              text: "Реши задание на изображении подробно и пошагово. В конце напиши: Ответ:",
            },
          ],
        },
      ],
    });

    const text = response.text;
    res.json({ solution: text });

  } catch (error) {
    console.error("Ошибка AI:", error);
    res.status(500).json({ error: "Ошибка генерации" });
  }
});

// === РАЗДАЧА FRONTEND ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});