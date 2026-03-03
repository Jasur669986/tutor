import * as genai from "@google/genai";

const client = new genai.Client({
  apiKey: process.env.GOOGLE_API_KEY
});

async function listModels() {
  try {
    const response = await client.models.list();
    console.log("Модели:", response.models || response);
  } catch (err) {
    console.error("Ошибка получения моделей:", err);
  }
}

listModels();