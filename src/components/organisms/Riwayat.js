'use client'
import React, { useState } from 'react';

const ProgressList = () => {
  // Data JSON seperti di screenshot
  const [jsonData, setJsonData] = useState({
    "hasil": [
      {
        "kataTarget": "bawang",
        "hasilPengucapan": "bawang",
        "benar": true
      },
      {
        "kataTarget": "bawang",
        "hasilPengucapan": "bawang",
        "benar": true
      },
      {
        "kataTarget": "apel",
        "hasilPengucapan": "apel",
        "benar": true
      },
      {
        "kataTarget": "jeruk",
        "hasilPengucapan": "jeruk",
        "benar": true
      },
      {
        "kataTarget": "mangga",
        "hasilPengucapan": "manga",
        "benar": false
      },
      {
        "kataTarget": "pisang",
        "hasilPengucapan": "pisang",
        "benar": true
      },
      {
        "kataTarget": "tomat",
        "hasilPengucapan": "tomat",
        "benar": true
      },
      {
        "kataTarget": "wortel",
        "hasilPengucapan": "worte",
        "benar": false
      },
      {
        "kataTarget": "wortel",
        "hasilPengucapan": "wortel",
        "benar": true
      },
      {
        "kataTarget": "kubis",
        "hasilPengucapan": "kubis",
        "benar": true
      },
      {
        "kataTarget": "bayam",
        "hasilPengucapan": "bayan",
        "benar": false
      },
      {
        "kataTarget": "bayam",
        "hasilPengucapan": "bayam",
        "benar": true
    },
    {
        "kataTarget": "bayam",
        "hasilPengucapan": "bayam",
        "benar": true
    }
    ]
  });

  // Hitung statistik dari JSON
  const totalWords = jsonData.hasil.length;
  const correctWords = jsonData.hasil.filter(item => item.benar).length;
  const incorrectWords = totalWords - correctWords;

  // Kelompokkan data berdasarkan kataTarget
  const groupedData = jsonData.hasil.reduce((acc, item) => {
    const target = item.kataTarget;
    if (!acc[target]) {
      acc[target] = {
        kataTarget: target,
        attempts: [],
        totalAttempts: 0,
        correctAttempts: 0
      };
    }
    
    acc[target].attempts.push({
      hasilPengucapan: item.hasilPengucapan,
      benar: item.benar
    });
    acc[target].totalAttempts++;
    if (item.benar) {
      acc[target].correctAttempts++;
    }
    
    return acc;
  }, {});

  // Convert ke array untuk rendering
  const groupedArray = Object.values(groupedData);

  const ProgressItem = ({ groupedItem, index }) => {
    const { kataTarget, correctAttempts, totalAttempts, attempts } = groupedItem;
    const percentage = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const accuracy = Math.round(percentage);
    
    return (
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        {/* Header kata target */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">&ldquo;{kataTarget}&rdquo;</h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 font-medium">
              {correctAttempts}/{totalAttempts} benar
            </span>
            <span className={`text-sm px-3 py-1 rounded-full font-bold ${
              accuracy >= 80 ? 'bg-green-100 text-green-700' :
              accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full transition-all duration-700 ease-out ${
              accuracy >= 80 ? 'bg-gradient-to-r from-[#19AC63] to-[#44CC88]' :
              accuracy >= 60 ? 'bg-gradient-to-r from-[#FFBB1B] to-[#FFDC33]' :
              'bg-gradient-to-r from-[#DD2626] to-[#FF4A4A]'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Detail attempts */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 font-medium mb-2">
            Riwayat Pengucapan ({attempts.length}x):
          </div>
          <div className="flex flex-wrap gap-2">
            {attempts.map((attempt, attemptIndex) => (
              <span
                key={attemptIndex}
                className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                  attempt.benar
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                &ldquo;{attempt.hasilPengucapan}&rdquo; {attempt.benar ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Fungsi untuk simulasi data baru
  const addNewResult = (kataTarget, hasilPengucapan) => {
    const isCorrect = kataTarget.toLowerCase() === hasilPengucapan.toLowerCase();
    const newResult = {
      kataTarget,
      hasilPengucapan,
      benar: isCorrect
    };
    
    setJsonData(prev => ({
      ...prev,
      hasil: [...prev.hasil, newResult]
    }));
  };


  // Fungsi untuk load sample data
  const loadSampleData = () => {
    setJsonData({
      "hasil": [
        {
        "kataTarget": "bawang",
        "hasilPengucapan": "bawang",
        "benar": true
      },
      {
        "kataTarget": "bawang",
        "hasilPengucapan": "bawang",
        "benar": true
      },
      {
        "kataTarget": "apel",
        "hasilPengucapan": "apel",
        "benar": true
      },
      {
        "kataTarget": "jeruk",
        "hasilPengucapan": "jeruk",
        "benar": true
      },
      {
        "kataTarget": "mangga",
        "hasilPengucapan": "manga",
        "benar": false
      },
      {
        "kataTarget": "pisang",
        "hasilPengucapan": "pisang",
        "benar": true
      },
      {
        "kataTarget": "tomat",
        "hasilPengucapan": "tomat",
        "benar": true
      },
      {
        "kataTarget": "wortel",
        "hasilPengucapan": "worte",
        "benar": false
      },
      {
        "kataTarget": "wortel",
        "hasilPengucapan": "wortel",
        "benar": true
      },
      {
        "kataTarget": "kubis",
        "hasilPengucapan": "kubis",
        "benar": true
      },
      {
        "kataTarget": "bayam",
        "hasilPengucapan": "bayan",
        "benar": false
      },
      {
        "kataTarget": "bayam",
        "hasilPengucapan": "bayam",
        "benar": true
      },
      {
        "kataTarget": "bayam",
        "hasilPengucapan": "bayam",
        "benar": true
      }
    ]
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Hasil Pengucapan</h2>
          <div className="text-sm">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-green-600">
              {Object.keys(groupedData).length} Kata
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-green-100">
          Total Percobaan: {totalWords} | Akurasi: {totalWords > 0 ? Math.round((correctWords/totalWords) * 100) : 0}%
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded-b-lg shadow-lg">
        {groupedArray.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Belum ada data hasil pengucapan</p>
            <button
              onClick={loadSampleData}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors"
            >
              Load Sample Data
            </button>
          </div>
        ) : (
          <div className="max-h-600 overflow-y-auto">
            {groupedArray.map((groupedItem, index) => (
              <ProgressItem key={groupedItem.kataTarget} groupedItem={groupedItem} index={index} />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {groupedArray.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Ringkasan:</div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{Object.keys(groupedData).length}</div>
                <div className="text-xs text-gray-500">Kata</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-700">{totalWords}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{correctWords}</div>
                <div className="text-xs text-gray-500">Benar</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{incorrectWords}</div>
                <div className="text-xs text-gray-500">Salah</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressList;