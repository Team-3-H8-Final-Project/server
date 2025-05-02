require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const { question } = require('../models');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

class Controller {
  static async generateQuestions(req, res, next) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Buatlah daftar kalimat-kalimat dalam bahasa Indonesia yang bisa digunakan untuk tes kemampuan berbicara bahasa Inggris. Setiap kalimat harus memiliki format sebagai berikut:

kalimat : "[Kalimat Bahasa Indonesia]"
level : "[Tingkat Kesulitan: Pemula, Menengah, Lanjutan, Fasih]"
jawabanBenar : "[Terjemahan Bahasa Inggris yang Benar]"

Sertakan minimal 5 contoh kalimat untuk setiap level kesulitan. Pastikan kalimat-kalimat tersebut bervariasi dalam struktur dan kosakata. Fokus pada kalimat-kalimat yang umum digunakan dalam percakapan sehari-hari. Output harus berupa array JSON.`,
      });

      if (!response.text || typeof response.text !== 'string') {
        return res.status(500).json({ message: 'Gagal menerima respons teks dari AI.' });
      }

      console.log("Response Text:", response.text);

      try {
        const cleanedResponseText = response.text.trim();
        const withoutLeadingTicks = cleanedResponseText.startsWith("```json") ? cleanedResponseText.substring(7) : cleanedResponseText;
        const withoutTrailingTicks = withoutLeadingTicks.endsWith("```") ? withoutLeadingTicks.slice(0, -3) : withoutLeadingTicks;
        const finalCleanedText = withoutTrailingTicks.trim();

        const generatedData = JSON.parse(finalCleanedText);
        const questions = generatedData.map((item) => ({
          question: item.kalimat,
          answer: item.jawabanBenar,
          level: item.level,
        }));

        const savedQuestions = await question.bulkCreate(questions);

        res.status(201).json({
          message: "Questions generated and saved successfully",
          data: savedQuestions,
        });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        console.error("Teks yang gagal di-parse:", response.text);
        return res.status(500).json({ message: 'Gagal memproses respons JSON dari AI.', error: parseError.message });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionsByLevel(req, res, next) {
    try {
      const { level } = req.query;

      if (!level) {
        return res.status(400).json({ message: "Level is required" });
      }

      const allowedLevels = ['Pemula', 'Menengah', 'Lanjutan', 'Fasih'];
      if (!allowedLevels.includes(level)) {
        return res.status(400).json({ message: `Invalid level. Allowed levels are: ${allowedLevels.join(', ')}` });
      }

      const questions = await question.findAll({
        where: { level },
        attributes: ['id', 'question', 'answer', 'level'],
      });

      if (questions.length === 0) {
        return res.status(404).json({ message: `No questions found for level: ${level}` });
      }

      res.status(200).json({
        message: `Questions for level: ${level}`,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = Controller;