require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { question, User, Challenge, Level, Conversation } = require("../models");

const ai = new GoogleGenAI({ apiKey: "AIzaSyA3bzCCK6ckqAkzKknoC2hDJJICM9GiZnY" });

class Controller {
  static async generateGrammar(req, res, next) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Buatlah daftar kalimat-kalimat dalam bahasa Indonesia yang bisa digunakan untuk tes kemampuan berbicara bahasa Inggris. Setiap kalimat harus memiliki format sebagai berikut:

      kalimat : "[Kalimat Bahasa Indonesia]"
      level : "[Tingkat Kesulitan: Pemula, Menengah, Lanjutan, Fasih]"
      jawabanBenar : "[Terjemahan Bahasa Inggris yang Benar]"

      Sertakan minimal 5 contoh kalimat untuk setiap level kesulitan. Pastikan kalimat-kalimat tersebut bervariasi dalam struktur dan kosakata. Fokus pada kalimat-kalimat yang umum digunakan dalam percakapan sehari-hari. Output harus berupa array JSON.`,
      });

      try {
        const cleanedResponseText = response.text.trim();
        const withoutLeadingTicks = cleanedResponseText.startsWith("```json")
          ? cleanedResponseText.substring(7)
          : cleanedResponseText;
        const withoutTrailingTicks = withoutLeadingTicks.endsWith("```")
          ? withoutLeadingTicks.slice(0, -3)
          : withoutLeadingTicks;
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

      const allowedLevels = ["Pemula", "Menengah", "Lanjutan", "Fasih"];
      if (!allowedLevels.includes(level)) {
        return res.status(400).json({
          message: `Invalid level. Allowed levels are: ${allowedLevels.join(
            ", "
          )}`,
        });
      }

      const questions = await question.findAll({
        where: { level },
        attributes: ["id", "question", "answer", "level"],
      });

      res.status(200).json({
        message: `Questions for level: ${level}`,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }
  static async generateChallenge(req, res, next) {
    try {
      const { theme } = req.body;

      if (!theme) {
        return res.status(400).json({
          message: "Theme is required"
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Buat daftar soal bahasa Indonesia untuk tes kemampuan bahasa Inggris dengan tema "${theme}". Format setiap item:
  
  {
    kalimat: "[Kalimat Bahasa Indonesia]",
    level: "[Pemula | Menengah | Lanjutan | Fasih]",
    jawabanBenar: "[Terjemahan yang benar]",
    pilihanJawaban: ["...", "...", "...", "..."] <- ini termasuk jawabanBenar dan ingan jawaban benar kadang ada di posisi pertama, kadang ada di posisi kedua, kadang ada di posisi ke tiga, dan kadang juga ada di posisi ke empat jadi tidak netap ya
  }
  
  Buat minimal 5 soal untuk setiap level. Pastikan pilihan jawaban masuk akal dan bervariasi. dan buat ini dalam format json.`,
      });

      const cleanedText = response.text
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (err) {
        return res.status(500).json({ message: "Gagal memproses data AI", error: err.message });
      }

      const formattedChallenges = parsed.map((item) => ({
        question: item.kalimat,
        answer: item.jawabanBenar,
        level: item.level,
        options: item.pilihanJawaban,
        theme: theme
      }));

      const savedChallenges = await Challenge.bulkCreate(formattedChallenges);

      res.status(201).json({
        message: "Generated and saved successfully",
        data: savedChallenges,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getChallenges(req, res, next) {
    try {
      const { theme } = req.query;

      if (!theme) {
        return res.status(400).json({
          message: "Theme is required",
        });
      }

      const challenges = await Challenge.findAll({
        where: { theme },
        attributes: ["id", "question", "answer", "level", "options", "theme"],
        order: [
          ["level", "ASC"],
          ["id", "ASC"],
        ],
      });

      res.status(200).json({
        message: `Challenges for theme: ${theme}`,
        data: challenges,
      });
    } catch (error) {
      next(error);
    }
  }
  static async generateConversation(req, res, next) {
    try {
      let { topic, categories, durationLabel } = req.body;
      const { id } = req.user;

      const user = await User.findByPk(id, {
        include: {
          model: Level,
          as: "currentLevel",
          attributes: ["id", "name"],
        },
      });

      let level = "Pemula";
      if (user?.currentLevel?.name) {
        level = user.currentLevel.name;
      }

      let amount;
      switch (durationLabel) {
        case "Pendek":
          amount = 4;
          break;
        case "Sedang":
          amount = 7;
          break;
        case "Panjang":
          amount = 10;
          break;
        default:
          amount = 5;
      }
      if (typeof categories === "string") {
        categories = categories.split(",").map((s) => s.trim());
      }
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Buatlah pertanyaan untuk latihan percakapan bahasa Inggris dengan siswa.
        Topik percakapan yang dipilih adalah: ${topic}.
        Kategori latihan yang ingin difokuskan adalah: ${categories.join(", ")}.
        Tingkat kesulitan pertanyaan disesuaikan dengan level siswa: ${level}.
        Durasi percakapan yang diinginkan adalah kategori: ${durationLabel}, jadi jumlah pertanyaan yang diberikan kira-kira ${amount} pertanyaan.
        
        Pertanyaan harus alami, mudah dipahami, dan relevan dengan topik. Fokus pada penggunaan kalimat yang umum digunakan dalam kehidupan nyata.
        
        Kembalikan hanya daftar pertanyaan dalam bahasa Inggris, tanpa teks tambahan apa pun.
        Format hasil harus seperti ini:
        ["Question 1", "Question 2", "Question 3", ...]
        
        Jangan gunakan karakter spesial seperti "/", "*", atau simbol lain yang bisa mengganggu asisten suara.`,
      });

      const responseText = response.text;
      let questions;
      try {
        questions = JSON.parse(responseText);
        if (
          !Array.isArray(questions) ||
          !questions.every((q) => typeof q === "string")
        ) {
          throw {
            name: "BADREQUEST",
            message: "Invalid questions format",
          };
        }
      } catch (error) {
        console.error("Error parsing questions:", error);
        throw {
          name: "BADREQUEST",
          message: "Failed to generate valid questions",
        };
      }
      const conversation = await Conversation.create({
        topic,
        questions,
        durationLabel,
        categories,
        userId: id,
        finalized: false,
      });
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error in create Conversation:", error);
      next(error);
    }
  }
  static async getConversations(req, res, next) {
    try {
      const { id } = req.user;
      const conversations = await Conversation.findAll({
        where: { userId: id, finalized: false },
        attributes: ["id", "topic", "durationLabel", "categories"],
      });

      if (conversations.length === 0) {
        return res.status(404).json({ message: "No conversations found" });
      }

      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  }
  static async deleteConversation(req, res, next) {
    try {
      const { id } = req.params;
      const conversation = await Conversation.findByPk(id);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      await conversation.destroy();
      res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
