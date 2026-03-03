import * as genai from "@google/genai";

// Создаём клиент
const client = new genai.Client({
  apiKey: process.env.GOOGLE_API_KEY
});

// Пример использования генерации текста
async function generateText(prompt) {
  const response = await client.models.generateText({
    model: "models/text-bison-001",
    prompt: prompt,
  });
  console.log(response);
}

// Использование
generateText("Напиши короткий отзыв о файле example.txt");