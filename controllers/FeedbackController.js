const { GoogleGenAI } = require("@google/genai");
const { Feedback } = require("../models");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

class FeedbackController {
  static async generateFeedback(req, res, next) {
    try {
      const { type } = req.params;
      const { id } = req.user;
      let response;

      if (type === "conversation") {
        const transcript = JSON.parse(req.body.transcript);
        const formattedTranscript = transcript
          .map((item) => `- ${item.role}: ${item.content}`)
          .join("\n");

        response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `
            Kamu adalah pelatih bahasa AI yang menganalisis latihan berbicara bahasa Inggris dari seorang siswa. Tugasmu adalah mengevaluasi performa mereka berdasarkan kategori pembelajaran bahasa yang terstruktur. Berikan penilaian yang akurat dan membangun. Jika siswa membuat kesalahan atau menunjukkan kelemahan, jelaskan dengan jelas dan berikan saran spesifik.

            Transkrip dari ucapan siswa:
            ${formattedTranscript}

            **Instruksi:**
            Kembalikan respons dalam format **JSON yang valid** dengan struktur berikut:

            \`\`\`json
            {
              "categoryScores": {
                "Kefasihan": 0-100,
                "Pengucapan": 0-100,
                "Tata Bahasa dalam Ucapan": 0-100,
                "Penggunaan Kosakata": 0-100
              },
              "strengths": [
                "Daftar kekuatan siswa dalam berbicara"
              ],
              "areasForImprovement": [
                "Daftar area yang perlu ditingkatkan secara spesifik"
              ],
              "finalAssessment": "Berikan ringkasan singkat dan jelas tentang performa keseluruhan siswa"
            }
            \`\`\`

            Ikuti format ini dengan ketat dan jangan sertakan teks tambahan di luar JSON.
          `,
        });
      } else if (type === "challenge") {
        const { answers } = req.body;

        response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `
            Kamu adalah pelatih bahasa AI yang menganalisis hasil latihan kuis pilihan ganda bahasa Inggris dari seorang siswa. Tugasmu adalah mengevaluasi performa mereka berdasarkan kategori pembelajaran bahasa yang terstruktur. Tinjau jawaban siswa terhadap setiap soal dengan seksama. Jika terdapat kesalahan, berikan penjelasan yang jelas serta saran yang dapat membantu siswa memahami materi dengan lebih baik.

            Data jawaban siswa:
            ${JSON.stringify(answers, null, 2)}

            **Instruksi:**
            Kembalikan respons dalam format **JSON yang valid** dengan struktur berikut:

            \`\`\`json
            {
              "categoryScores": {
                "Pemahaman Grammar": 0-100,
                "Pemahaman Kosakata": 0-100,
                "Pemahaman Makna dan Konteks": 0-100
              },
              "strengths": [
                "Daftar kekuatan siswa dalam menjawab soal kuis"
              ],
              "areasForImprovement": [
                "Daftar area yang perlu ditingkatkan secara spesifik"
              ],
              "finalAssessment": "Berikan ringkasan singkat dan jelas tentang performa keseluruhan siswa berdasarkan jawaban kuis"
            }
            \`\`\`
            Ikuti format ini dengan ketat dan **jangan sertakan teks tambahan di luar JSON**.
          `,
        });
      } else if (type === "grammar") {
        
      } else {
        throw new Error("Invalid type provided");
      }      
      const responseText = response.text;
      const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
      let feedbackData = JSON.parse(cleanedResponse);
      const categoryScores = feedbackData.categoryScores;
      const totalScore =
        Object.values(categoryScores).reduce((a, b) => a + b, 0) /
        Object.keys(categoryScores).length;

      const feedback = await Feedback.create({
        testType: type,
        totalScore,
        categoryScores,
        strengths: feedbackData.strengths,
        areasForImprovement: feedbackData.areasForImprovement,
        finalAssessment: feedbackData.finalAssessment,
        userId: id,
      });
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }
  static async getFeedback(req, res, next) {
    try {
      const { id } = req.user;
      const feedback = await Feedback.findAll({
        where: { userId: id },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  }
  static async getFeedbackById(req, res, next) {
    try {
      const { id } = req.params;
      const feedback = await Feedback.findByPk(id);
      if (!feedback) {
        throw {
          name: "NotFound",
          message: "Feedback not found",
        }; 
      }
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  }
  static async deleteFeedback(req, res, next) {
    try {
      const { id } = req.params;
      const feedback = await Feedback.findByPk(id);
      if (!feedback) {
        throw {
          name: "NotFound",
          message: "Feedback not found",
        };
      }
      await feedback.destroy();
      res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FeedbackController;
