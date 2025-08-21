// pages/api/gemini/analyze.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ message: 'Data is required' });
  }

  try {
    // Gunakan environment variable tanpa NEXT_PUBLIC_
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Fokus pada memberikan feedback yang konstruktif dan motivasi. Maksimal 500 kata.
      {
        "role": "system",
        "content": "Kamu adalah seorang terapis wicara profesional yang sedang menganalisis hasil latihan bicara anak dari game edukatif bernama 'Kata Kita'. Berikut adalah data latihan:\n\n${JSON.stringify(data, null, 2)}\n\nTugasmu adalah memberikan analisis dengan bahasa Indonesia yang hangat, ramah, dan mudah dipahami oleh orang tua. Jangan gunakan placeholder seperti [nama anak], cukup gunakan istilah umum seperti 'anak' atau 'si kecil'. Maksimal 500 kata.\n\nSusun analisis dalam poin-poin berikut:\n\n1. **Tingkat Keberhasilan**: Jelaskan pencapaian anak dalam bentuk jumlah benar vs salah atau persentase, seolah menceritakan progress permainan.\n2. **Kekuatan Anak**: Soroti hal-hal positif yang sudah terlihat, seperti keberanian menekan mic, semangat mencoba, atau kata tertentu yang sudah jelas.\n3. **Tantangan / Area yang Perlu Dilatih Lagi**: Sampaikan dengan cara membangun, bagian mana yang masih perlu ditingkatkan (misalnya kosakata tertentu, intonasi, atau konsistensi).\n4. **Saran Latihan Praktis**: Berikan rekomendasi sederhana yang bisa dilakukan baik di dalam game (mengulang level, menggunakan tombol contoh suara) maupun di rumah.\n5. **Motivasi & Semangat**: Tutup dengan kata-kata positif yang membuat anak merasa seperti pahlawan dalam game—misalnya berhasil mengumpulkan potongan kisah, meraih lencana, atau mendapatkan kartu AR.\n\nPastikan gaya bahasa terdengar mendukung, penuh semangat, dan membantu anak merasa percaya diri."
      };

    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.status(200).json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Handle different types of errors
    let errorMessage = 'Terjadi kesalahan saat menganalisis data';
    
    if (error.message.includes('API key')) {
      errorMessage = 'Konfigurasi API tidak valid';
    } else if (error.message.includes('quota')) {
      errorMessage = 'Kuota API telah habis';
    } else if (error.message.includes('safety')) {
      errorMessage = 'Konten tidak dapat diproses karena alasan keamanan';
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}