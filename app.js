import React, { useState, useEffect } from 'react';
import { useLaunchParams, initCloudStorage } from '@telegram-apps/sdk-react';
import translations from './i18n'; // файл с переводами, который мы обсуждали

function App() {
  const lp = useLaunchParams();
  const lang = lp.initData?.user?.languageCode || 'en';
  const t = translations[lang] || translations['en'];

  const [image, setImage] = useState(null);
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState(3); // Начальный лимит

  // Функция для обработки загрузки фото
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      sendToAI(file);
    }
  };

  // Имитация отправки на бэкенд к Gemini
  
  const sendToAI = async (file) => {
  setLoading(true);

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://xn----7sbbfng0fj1d.onrender.com/solve', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    setSolution(data.solution);
    setLimits(prev => prev - 1);

  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось связаться с ИИ-репетитором");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans">
      {/* Шапка */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-400">AI Tutor</h1>
        <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">
          {t.limits}: {limits}/3
        </span>
      </div>

      {/* Зона загрузки */}
      <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center mb-6">
        {image ? (
          <img src={image} alt="Task" className="mx-auto max-h-48 rounded-lg mb-4" />
        ) : (
          <div className="text-slate-500 mb-4">📸</div>
        )}

        <label className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all">
          {t.solve}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      {/* Окно решения */}
      {loading && <div className="animate-pulse text-blue-400 text-center">{t.processing}...</div>}

      {solution && (
        <div className="bg-slate-800 rounded-2xl p-5 shadow-xl border border-slate-700">
          <h2 className="text-blue-400 font-bold mb-3">{t.solution_title}:</h2>
          <div className="whitespace-pre-line text-slate-200 leading-relaxed">
            {solution}
          </div>
        </div>
      )}

      {/* Кнопка рекламы (Adsgram) */}
      {limits === 0 && (
        <button className="w-full mt-4 bg-amber-500 text-black font-bold py-4 rounded-xl shadow-lg">
          📺 {t.watch_ad_for_limit}
        </button>
      )}
    </div>
  );
}

export default App;
