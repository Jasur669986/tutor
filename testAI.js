import * as genai from "@google/genai";

async function generateText(prompt) {
  try {
    const response = await genai.text.generate({
      model: "models/text-bison-001",   // рабочая модель
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 300,
      apiKey: process.env.GOOGLE_API_KEY
    });

    console.log(response.output[0].content);
  } catch (err) {
    console.error("Ошибка AI:", err);
  }
}

// пример использования
generateText("Напиши короткий отзыв о файле example.txt");