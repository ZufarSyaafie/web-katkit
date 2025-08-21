'use client'
import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, RefreshCw, Copy, AlertCircle } from "lucide-react";

// Komponen untuk merender markdown dengan style yang konsisten
const MarkdownRenderer = ({ content }) => {
  // Fungsi untuk mengonversi markdown ke HTML dengan style
  const renderMarkdown = (text) => {
    let html = text;
    
    // Headers
    html = html.replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-base font-semibold text-gray-800 mt-4 mb-2 first:mt-0">$1</h3>');
    html = html.replace(/## (.*?)(?=\n|$)/g, '<h2 class="text-lg font-semibold text-gray-800 mt-4 mb-2 first:mt-0">$1</h2>');
    html = html.replace(/# (.*?)(?=\n|$)/g, '<h1 class="text-xl font-semibold text-gray-800 mt-4 mb-2 first:mt-0">$1</h1>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
    
    // Lists - numbered
    html = html.replace(/^\d+\.\s(.*)$/gm, '<li class="ml-4 mb-1 text-gray-700">$1</li>');
    
    // Lists - bullet points
    html = html.replace(/^[-*]\s(.*)$/gm, '<li class="ml-4 mb-1 text-gray-700 list-disc">$1</li>');
    
    // Wrap consecutive li elements in ul
    html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="mb-3 ml-2">$1</ul>');
    
    // Code blocks (triple backticks)
    html = html.replace(/```(.*?)```/gs, '<div class="bg-gray-100 rounded-md p-3 my-2 font-mono text-xs text-gray-800 overflow-x-auto">$1</div>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">$1</code>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-3 text-gray-700">');
    html = html.replace(/\n/g, '<br />');
    
    // Wrap in paragraph if no other block elements
    if (!html.includes('<h') && !html.includes('<ul') && !html.includes('<div')) {
      html = '<p class="mb-3 text-gray-700">' + html + '</p>';
    }
    
    // Clean up any empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/g, '');
    
    return html;
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ 
        __html: renderMarkdown(content) 
      }}
    />
  );
};

const SummaryCard = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionTicket, setSessionTicket] = useState('');
  const [dataInfo, setDataInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Ambil session ticket saat komponen dimount
  useEffect(() => {
    const ticket = localStorage.getItem('playfab_session_ticket');
    if (ticket) {
      setSessionTicket(ticket);
    }
  }, []);

  const fetchPlayFabData = async (ticket) => {
    // Use internal API route instead of direct PlayFab call
    const response = await fetch('/api/playfab/data?keys=RiwayatLatihan', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ticket}`,
        'Content-Type': 'application/json'
      }
    });

    const playfabData = await response.json();

    if (playfabData.code !== 200) {
      throw new Error(playfabData.message || 'Gagal mengambil data dari PlayFab');
    }

    if (playfabData.data && playfabData.data.Data && playfabData.data.Data.RiwayatLatihan) {
      try {
        return JSON.parse(playfabData.data.Data.RiwayatLatihan.Value);
      } catch (parseError) {
        throw new Error('Format data PlayFab tidak valid');
      }
    } else {
      throw new Error('Data RiwayatLatihan tidak ditemukan');
    }
  };

  const analyzeWithGemini = async (jsonData) => {
    // Use internal API route instead of direct Gemini call
    const response = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: jsonData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menganalisis dengan AI');
    }

    const result = await response.json();
    return result.analysis;
  };

  const handleAnalyze = async () => {
    if (!sessionTicket) {
      setError('Session tidak valid. Silakan login kembali ke aplikasi utama.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setDataInfo(null);

    try {
      // Ambil data dari PlayFab
      const jsonData = await fetchPlayFabData(sessionTicket);
      
      // Hitung statistik
      const totalAttempts = jsonData.hasil?.length || 0;
      const correctAttempts = jsonData.hasil ? jsonData.hasil.filter(item => item.benar).length : 0;
      const uniqueWords = jsonData.hasil ? [...new Set(jsonData.hasil.map(item => item.kataTarget))].length : 0;
      const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

      setDataInfo({
        totalAttempts,
        correctAttempts,
        uniqueWords,
        accuracy
      });

      // Analisis dengan Gemini melalui API route
      const aiSummary = await analyzeWithGemini(jsonData);
      setSummary(aiSummary);
      setIsExpanded(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    // Convert markdown to plain text for copying
    const plainText = summary
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/```.*?```/gs, '$1') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/^\d+\.\s/gm, '• ') // Convert numbered lists to bullets
      .replace(/^[-*]\s/gm, '• '); // Standardize bullets
    
    navigator.clipboard.writeText(plainText).then(() => {
      // Simple feedback - could be replaced with a toast notification
      const button = document.querySelector('#copy-btn');
      const originalText = button.textContent;
      button.textContent = 'Tersalin!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    });
  };

  const resetAnalysis = () => {
    setSummary('');
    setDataInfo(null);
    setError('');
    setIsExpanded(false);
  };

  // Loading Skeleton untuk konsistensi dengan Riwayat.js
  const LoadingSkeleton = () => {
    return (
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-3 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-white bg-opacity-20 rounded w-40 animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white p-4 rounded-b-lg shadow-lg">
          {/* Status skeleton */}
          <div className="h-6 bg-gray-300 rounded w-24 animate-pulse mb-4"></div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="h-6 bg-gray-300 rounded w-8 mx-auto animate-pulse mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-12 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state - menggunakan skeleton yang konsisten dengan Riwayat.js
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Header - mengikuti style dari Riwayat.js */}
      <div className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Analisis AI</h2>
          </div>
          <div className="flex items-center space-x-2">
            {summary && (
              <button
                onClick={resetAnalysis}
                className="px-2 py-1 rounded text-xs transition-colors"
                title="Reset Analisis"
              >
                <RefreshCw className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-200">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Content - mengikuti structure dari Riwayat.js */}
      <div className="bg-white p-4 rounded-b-lg shadow-lg">
        {/* Data Info Cards - konsisten dengan summary stats di Riwayat.js */}
        {dataInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">Statistik Data:</div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{dataInfo.totalAttempts}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{dataInfo.accuracy}%</div>
                <div className="text-xs text-gray-500">Akurasi</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{dataInfo.correctAttempts}</div>
                <div className="text-xs text-gray-500">Benar</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{dataInfo.uniqueWords}</div>
                <div className="text-xs text-gray-500">Kata</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Button atau Content */}
        {!summary ? (
          <div className="text-center py-8">
            {!error ? (
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Siap untuk Analisis
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Dapatkan insight mendalam tentang progress pembelajaran Anda
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={!sessionTicket}
                  className="bg-gradient-to-r from-[#FFBB1B] to-[#FFDC33] text-black font-medium py-2 px-6 rounded text-sm hover:from-yellow-600 hover:to-yellow-700  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center mx-auto"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analisis Sekarang
                </button>
              </div>
            ) : (
              <div className="text-center text-red-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-4" />
                <p className="mb-4">{error}</p>
                <button
                  onClick={handleAnalyze}
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Summary Result */
          <div className="space-y-4">
            {/* Result Header */}
            <div className="mb-4 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-green-600" />
                  Hasil Analisis AI
                </h3>
                <button
                  id="copy-btn"
                  onClick={copyToClipboard}
                  className="flex items-center text-xs text-green-600 hover:text-green-700 font-medium bg-green-100 hover:bg-green-200 px-3 py-1 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </button>
              </div>
              
              {/* Content dalam max-height container seperti di Riwayat.js */}
              <div className="max-h-96 overflow-y-auto">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <MarkdownRenderer content={summary} />
                  </div>
                </div>
              </div>

              {/* Tips section */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs">
                  💡 <strong>Tips:</strong> Gunakan analisis ini sebagai panduan untuk meningkatkan kemampuan pengucapan. 
                  Analisis ulang secara berkala untuk memantau progress.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;