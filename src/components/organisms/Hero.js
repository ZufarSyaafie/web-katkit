import React from 'react';
import Image from 'next/image';
import { ArrowRightCircle } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[70vh] xl:h-[70vh] w-full">
      {/* Logo + Button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
        <img
          src="/image/logo.png"
          alt="Logo"
          className="w-40 sm:w-52 md:w-64 lg:w-72 xl:w-80 2xl:w-[26rem] h-auto"
        />

        <button className="mt-4 flex items-center gap-2 rounded-lg sm:rounded-xl md:rounded-2xl 
          bg-gradient-to-r from-[#FFBB1B] to-[#FFDC33] 
          px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base md:text-lg 
          text-[#363A36] font-semibold shadow-md
          transition-all duration-300 
          hover:from-yellow-600 hover:to-yellow-700 
          active:from-yellow-700 active:to-yellow-800 
          hover:scale-105 active:scale-95">
          DOWNLOAD
          <ArrowRightCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Background Hero */}
      <div className="absolute inset-0">
		<Image
		src="/image/hero.png"
		alt="Hero Background"
		className="object-cover object-center lg:object-[50%_30%]"
		fill
		sizes="100vw"
		priority
		/>
      </div>
    </div>
  );
}
