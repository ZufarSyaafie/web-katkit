/* eslint-disable @next/next/no-html-link-for-pages */
'use client'
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import ProgressCard from '@/components/organisms/ProgressCard';
import Riwayat from '@/components/organisms/Riwayat';

export default function Page() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = () => {
      // Ambil email dari localStorage
      const userEmail = localStorage.getItem('user_email');
      
      if (userEmail) {
        // Ekstrak nama dari email (bagian sebelum @)
        const name = userEmail.split('@')[0];
        
        // Kapitalisasi nama (huruf pertama kapital)
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        
        setUserName(formattedName);
      } else {
        // Jika tidak ada data user, redirect ke login
        window.location.href = '/login';
      }
      
      setIsLoading(false);
    };

    getUserData();
  }, []);

  // Tampilkan loading state
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="container flex flex-col space-y-8 max-w-md mx-auto px-4">
          <div className="mt-4 h-8 bg-gray-200 animate-pulse rounded w-48"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container flex flex-col space-y-8 max-w-md mx-auto px-4">
        <h1 className="mt-4 text-left text-2xl font-bold text-[#363A36]">
          Halo {userName} 👋
        </h1>
        <ProgressCard />
        <Riwayat />
      </div>
      <Footer />
    </>
  );
}