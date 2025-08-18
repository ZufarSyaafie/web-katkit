import React from 'react';

export default function StepCard({
	stepNumber = '1',
	title = 'Unduh file apk Kata Kita',
	descriptions = [
		'Sebelum Anda dapat meng-install dan menjalankan Kata Kita, Anda perlu mengunduh file apk Kata Kita.',
		'Klik tombol download di atas atau di sini untuk mengunduh file apk Kata Kita.',
	],
}) {
	return (
		<div className="mx-auto max-w-md rounded-2xl bg-gradient-to-tr from-[#19AC63] to-[#44CC88] p-6 text-white shadow-lg">
			{/* Step Badge */}
			<div className="mb-4">
				<span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-green-600">
					STEP {stepNumber}
				</span>
			</div>

			{/* Title */}
			<h2 className="mb-4 text-xl font-bold">{title}</h2>

			{/* Description */}
			{descriptions.map((desc, index) => (
				<p
					key={index}
					className={`text-sm leading-relaxed text-white ${
						index > 0 ? 'mt-3' : ''
					}`}
				>
					{desc}
				</p>
			))}
		</div>
	);
}
