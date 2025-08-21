'use client'
import React, { useState, useEffect } from 'react';
import { RefreshCw } from "lucide-react";

const ProgressCard = () => {
  const [data, setData] = useState({
    title: "Akurasi Pengucapan",
    description: "Tingkat keakuratan pengucapan berdasarkan latihan yang telah dilakukan",
    current: 0,
    total: 0,
    accuracy: 0
  });

  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionTicket, setSessionTicket] = useState('');

  // PlayFab configuration
  const PLAYFAB_BASE_URL = process.env.NEXT_PUBLIC_PLAYFAB_BASE_URL;
  const PLAYFAB_GET_DATA_URL = `${PLAYFAB_BASE_URL}/GetUserData`;

  // Ambil session ticket dan fetch data saat komponen dimount
  useEffect(() => {
    const ticket = localStorage.getItem('playfab_session_ticket');
    if (ticket) {
      setSessionTicket(ticket);
      fetchSpeechData(ticket);
    } else {
      setError('Session tidak valid. Silakan login kembali.');
      setIsLoading(false);
    }
  }, []);

  // Animasi persentase setelah data dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(data.accuracy);
    }, 300);
    return () => clearTimeout(timer);
  }, [data.accuracy]);

  // Fungsi untuk mengambil data riwayat dari PlayFab
  const fetchSpeechData = async (ticket) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(PLAYFAB_GET_DATA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication': ticket
        },
        body: JSON.stringify({
          Keys: ["RiwayatLatihan"]
        })
      });

      const responseData = await response.json();

      if (responseData.code === 200) {
        if (responseData.data && responseData.data.Data && responseData.data.Data.RiwayatLatihan) {
          try {
            // Parse JSON string dari PlayFab
            const riwayatData = JSON.parse(responseData.data.Data.RiwayatLatihan.Value);
            processRiwayatData(riwayatData);
          } catch (parseError) {
            console.error('Error parsing riwayat data:', parseError);
            setError('Format data tidak valid');
            setIsLoading(false);
          }
        } else {
          // Jika tidak ada data, set data kosong
          setData(prev => ({
            ...prev,
            current: 0,
            total: 0,
            accuracy: 0
          }));
          setIsLoading(false);
        }
      } else {
        setError(responseData.errorMessage || 'Gagal mengambil data riwayat');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Periksa koneksi internet Anda.');
      console.error('Fetch speech data error:', err);
      setIsLoading(false);
    }
  };

  // Proses data riwayat untuk menghitung akurasi
  const processRiwayatData = (riwayatData) => {
    const totalAttempts = riwayatData.hasil.length;
    const correctAttempts = riwayatData.hasil.filter(item => item.benar).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Hitung jumlah kata unik yang sudah dipraktikkan
    const uniqueWords = [...new Set(riwayatData.hasil.map(item => item.kataTarget))].length;

    setData(prev => ({
      ...prev,
      current: correctAttempts,
      total: totalAttempts,
      accuracy: accuracy,
      description: `Dari ${uniqueWords} kata yang dipraktikkan dengan ${totalAttempts} total percobaan`
    }));

    setIsLoading(false);
  };

  // Fungsi untuk refresh data
  const refreshData = () => {
    if (sessionTicket) {
      fetchSpeechData(sessionTicket);
    }
  };

  // Tentukan warna berdasarkan akurasi
  const getGradientColors = () => {
    if (data.accuracy >= 80) {
      return 'from-[#19AC63] to-[#44CC88]'; // Hijau
    } else if (data.accuracy >= 60) {
      return 'from-[#FFBB1B] to-[#FFDC33]'; // Kuning
    } else {
      return 'from-[#DD2626] to-[#FF4A4A]'; // Merah
    }
  };

  const getCircleColor = () => {
    if (data.accuracy >= 80) {
      return 'text-green-300';
    } else if (data.accuracy >= 60) {
      return 'text-yellow-300';
    } else {
      return 'text-red-300';
    }
  };

  // Komponen Loading Skeleton yang realistis
  const LoadingSkeleton = () => {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-tr from-[#19AC63] to-[#44CC88] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start">
          {/* Content kiri skeleton */}
          <div className="flex-1 pr-4">
            {/* Title skeleton */}
            <div className="h-7 bg-white bg-opacity-30 rounded-md mb-3 animate-pulse w-48"></div>
            
            {/* Description skeleton - 3 baris */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-white bg-opacity-20 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-4/5 animate-pulse"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="h-3 bg-white bg-opacity-20 rounded w-32 animate-pulse"></div>
          </div>

          {/* Progress Circle skeleton */}
          <div className="relative w-29 h-29">
            {/* Background circle skeleton */}
            <div className="w-full h-full rounded-full border-4 border-white border-opacity-20 animate-pulse">
              {/* Inner circle untuk simulasi progress */}
              <div className="absolute inset-2 rounded-full bg-white bg-opacity-10 animate-pulse"></div>
            </div>
            
            {/* Percentage text skeleton */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 bg-white bg-opacity-30 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state - menggunakan skeleton yang realistis
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto bg-gradient-to-r from-[#DD2626] to-[#FF4A4A] rounded-2xl p-6 text-white shadow-xl">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-3">Error</h2>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded text-sm transition-colors text-red-500 font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto bg-gradient-to-tr ${getGradientColors()} rounded-2xl p-6 text-white shadow-xl`}>
      <div className="flex justify-between items-start">
        {/* Content kiri */}
        <div className="flex-1 pr-4">
          <h2 className="text-xl font-bold mb-3">{data.title}</h2>
          <p className="text-white text-sm leading-relaxed opacity-100">
            {data.description}
          </p>
          <div className="mt-4 text-xs text-white opacity-80">
            Benar: {data.current} / {data.total} percobaan
          </div>
        </div>

        {/* Progress Circle */}
        <div className="relative w-29 h-29">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className={getCircleColor()}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              strokeOpacity="0.3"
            />
            {/* Progress circle */}
            <path
              className="text-white"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${animatedPercentage}, 100`}
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{
                transition: 'stroke-dasharray 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{data.accuracy}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;