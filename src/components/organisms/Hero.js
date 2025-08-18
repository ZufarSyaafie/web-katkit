import React from 'react';
import Image from 'next/image';
import { ArrowRightCircle } from 'lucide-react';

export default function Hero() {
	return (
		<div className="hero-container relative">
			{/* logo image */}
			<div className="logo-container absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center space-y-10">
				<img src="/image/logo.png" alt="Logo" className="scale-130" />
				<div className="font-semibold">
					<button className="mb-10 flex items-center gap-2 whitespace-nowrap rounded-3xl bg-gradient-to-r from-[#FFBB1B] to-[#FFDC33] px-4 py-2 text-[14px] text-[#363A36] shadow-md transition-all duration-300 hover:from-yellow-600 hover:to-yellow-700 active:from-yellow-700 active:to-yellow-800">
						DOWNLOAD
						<ArrowRightCircle size={16} />
					</button>
				</div>
			</div>
			<div>
				<Image
					src="/image/hero.png"
					alt="Hero"
					className="hero-image"
					width={800}
					height={600}
				/>
			</div>
		</div>
	);
}
