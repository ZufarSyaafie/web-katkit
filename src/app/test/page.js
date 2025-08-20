/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Navigation from '@/components/organisms/Navigation';
import Hero from '@/components/organisms/Hero';
import StepCard from '@/components/organisms/StepCard';
import Footer from '@/components/organisms/Footer';

export default function Page() {
	return (
		<>
			<Navigation />
			<Hero />
			{/* text jdul panduan instalasi  */}
			<h1 className=" py-4 text-center text-2xl font-bold text-[#363A36]">
				Panduan Instalasi Kata Kita
			</h1>
			<div className="container mx-auto flex flex-col items-center space-y-6 px-4">
				<StepCard
					stepNumber="1"
					title="Unduh file apk Kata Kita"
					descriptions={[
						'Sebelum Anda dapat meng-install dan menjalankan Kata Kita, Anda perlu mengunduh file apk Kata Kita.',
						'Klik tombol download di atas atau di sini untuk mengunduh file apk Kata Kita.',
					]}
				/>
				<StepCard
					stepNumber="2"
					title="Install file apk Kata Kita"
					descriptions={[
						'Setelah Anda mengunduh file apk Kata Kita, Anda perlu meng-install file tersebut.',
						'Pastikan Anda telah mengizinkan instalasi dari sumber yang tidak dikenal di pengaturan perangkat Anda.',
					]}
				/>
				<StepCard
					stepNumber="3"
					title="Sign up aplikasi Kata Kita"
					descriptions={[
						'Setelah berhasil meng-install, buka aplikasi dan klik play untuk melakukan registrasi dengan email dan password.',
						'Pastikan mengisi kolom email dan password sebelum klik signup. Kemudian klik signin untuk masuk ke akun.',
					]}
				/>
			</div>
			<Footer />
		</>
	);
}
