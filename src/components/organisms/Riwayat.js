'use client'
import React, { useState, useEffect } from 'react';
import { RefreshCw } from "lucide-react";

const ProgressList = () => {
  // State untuk menyimpan data dari PlayFab
  const [jsonData, setJsonData] = useState({ hasil: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionTicket, setSessionTicket] = useState('');

  // Ambil session ticket dari localStorage
  useEffect(() => {
    const ticket = localStorage.getItem('playfab_session_ticket');
    if (ticket) {
      setSessionTicket(ticket);
      fetchRiwayatData(ticket);
    } else {
      setError('Session tidak valid. Silakan login kembali.');
      setIsLoading(false);
    }
  }, []);

  // Fungsi untuk mengambil data riwayat menggunakan internal API
  const fetchRiwayatData = async (ticket) => {
    try {
      setIsLoading(true);
      setError('');

      // Call internal API route instead of directly calling PlayFab
      const response = await fetch('/api/playfab/data?keys=RiwayatLatihan', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ticket}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.code === 200) {
        // Cek apakah data RiwayatLatihan ada
        if (data.data && data.data.Data && data.data.Data.RiwayatLatihan) {
          try {
            // Parse JSON string dari PlayFab
            const riwayatData = JSON.parse(data.data.Data.RiwayatLatihan.Value);
            setJsonData(riwayatData);
          } catch (parseError) {
            console.error('Error parsing riwayat data:', parseError);
            setError('Format data tidak valid');
          }
        } else {
          // Jika tidak ada data, set data kosong
          setJsonData({ hasil: [] });
        }
      } else {
        setError(data.message || 'Gagal mengambil data riwayat');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Periksa koneksi internet Anda.');
      console.error('Fetch riwayat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menyimpan data menggunakan internal API
  const saveRiwayatData = async (newData) => {
    if (!sessionTicket) {
      setError('Session tidak valid');
      return;
    }

    try {
      const response = await fetch('/api/playfab/data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionTicket}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Data: {
            RiwayatLatihan: JSON.stringify(newData)
          }
        })
      });

      const data = await response.json();
      
      if (data.code !== 200) {
        console.error('Error saving data:', data.message);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

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

  // Komponen Loading Skeleton yang realistis
  const LoadingSkeleton = () => {
    return (
      <div className="w-full">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-3 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-white bg-opacity-20 rounded w-40 animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
              <div className="h-6 bg-white bg-opacity-20 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white p-4 rounded-b-lg shadow-lg">
          <div className="max-h-96 overflow-y-auto">
            {/* Skeleton untuk 3 progress items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-6 bg-gray-50 rounded-lg p-4">
                {/* Header skeleton */}
                <div className="flex justify-between items-center mb-3">
                  <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
                  <div className="flex items-center space-x-3">
                    <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-12 animate-pulse"></div>
                  </div>
                </div>

                {/* Progress bar skeleton */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="h-3 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
                </div>

                {/* Detail attempts skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((badge) => (
                      <div key={badge} className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats skeleton */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-5 bg-gray-300 rounded w-24 animate-pulse mb-2"></div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[1, 2, 3, 4].map((stat) => (
                <div key={stat}>
                  <div className="h-6 bg-gray-300 rounded w-8 mx-auto animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-12 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fungsi untuk menambahkan hasil baru (untuk testing atau dari komponen lain)
  const addNewResult = async (kataTarget, hasilPengucapan) => {
    const isCorrect = kataTarget.toLowerCase() === hasilPengucapan.toLowerCase();
    const newResult = {
      kataTarget,
      hasilPengucapan,
      benar: isCorrect
    };
    
    const newData = {
      ...jsonData,
      hasil: [...jsonData.hasil, newResult]
    };
    
    setJsonData(newData);
    await saveRiwayatData(newData);
  };

  // Fungsi untuk refresh data
  const refreshData = () => {
    if (sessionTicket) {
      fetchRiwayatData(sessionTicket);
    }
  };

  // Loading state - menggunakan skeleton yang realistis
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error && !jsonData.hasil.length) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Hasil Pengucapan</h2>
        </div>
        <div className="bg-white p-4 rounded-b-lg shadow-lg">
          <div className="text-center text-red-500 py-8">
            <p className="mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-2 rounded text-sm hover:bg-green-800 transition-colors font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-tr from-[#19AC63] to-[#44CC88] text-white px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Hasil Pengucapan</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              className="px-2 py-1 rounded text-xs transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-200">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded-b-lg shadow-lg">
        {groupedArray.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-4">Belum ada data hasil pengucapan</p>
            <div className="space-x-2">
              <button
                onClick={refreshData}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {groupedArray.map((groupedItem, index) => (
              <ProgressItem key={groupedItem.kataTarget} groupedItem={groupedItem} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressList;