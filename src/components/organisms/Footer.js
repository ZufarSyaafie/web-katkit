import React from 'react';
import {
	MessageCircle,
	Instagram,
	Facebook,
	Twitter,
	Linkedin,
} from 'lucide-react';

export default function Footer() {
	return (
		<footer className="mt-10 bg-gray-800 py-8 text-white">
			<div className="container mx-auto px-4">
				{/* Logo and Title */}
				<div className="mb-6 flex items-center justify-center">
					<div className="mr-3 flex h-8 w-8 items-center justify-center rounded">
						<img src="/image/logo.png" alt="Logo" className="scale-130" />
					</div>
					<span className="font-medium text-[#C0C4C4]">
						PKM-PM UGM Kata Kita
					</span>
				</div>

				{/* Social Media Icons */}
				<div className="mb-6 flex justify-center space-x-4">
					<a
						href="#"
						className="rounded bg-gray-700 p-2 transition-colors duration-300 hover:bg-gray-600"
					>
						<MessageCircle size={20} />
					</a>
					<a
						href="#"
						className="rounded bg-gray-700 p-2 transition-colors duration-300 hover:bg-gray-600"
					>
						<Instagram size={20} />
					</a>
					<a
						href="#"
						className="rounded bg-gray-700 p-2 transition-colors duration-300 hover:bg-gray-600"
					>
						<Facebook size={20} />
					</a>
					<a
						href="#"
						className="rounded bg-gray-700 p-2 transition-colors duration-300 hover:bg-gray-600"
					>
						<Twitter size={20} />
					</a>
					<a
						href="#"
						className="rounded bg-gray-700 p-2 transition-colors duration-300 hover:bg-gray-600"
					>
						<Linkedin size={20} />
					</a>
				</div>

				{/* Copyright */}
				<div className="text-center">
					<p className="text-sm text-gray-400">©Copyright All Right Reserved</p>
				</div>
			</div>
		</footer>
	);
}
