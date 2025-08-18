/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Image from 'next/image';

export default function Navigation() {
	return (
		<nav className="sticky top-0 z-50 w-full min-w-0 bg-white px-4 py-1 shadow-md">
			<div className="flex max-w-full items-center justify-between">
				<div className="flex flex-shrink-0 items-center">
					<a href="/">
						<Image src="/image/logo.png" alt="Logo" width={50} height={50} />
					</a>
				</div>
				<div className="flex flex-shrink-0 items-center space-x-4 font-medium">
					<button className="whitespace-nowrap rounded-md bg-gradient-to-l from-[#44CC88] to-[#19AC63] px-4 py-1 text-[14px] text-white transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800">
						Sign In
					</button>
				</div>
			</div>
		</nav>
	);
}
