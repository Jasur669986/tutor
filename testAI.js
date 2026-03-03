import * as genai from "@google/genai";

async function generateText(prompt) {
  try {
    // Вызываем текстовую генерацию напрямую через genai.text.generate
    const response = await genai.text.generate({
      model: "text-bison-001",
      prompt: prompt,
      temperature: 0.7,
      maxOutputTokens: 300,
      apiKey: process.env.GOOGLE_API_KEY
    });

    console.log("AI ответ:", response.outputText);
  } catch (err) {
    console.error("Ошибка AI:", err);
  }
}

// пример использования
generateText("Напиши короткий отзыв о файле example.txt");