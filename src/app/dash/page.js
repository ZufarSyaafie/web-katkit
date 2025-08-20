/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import ProgressCard from '@/components/organisms/ProgressCard';
import Riwayat from '@/components/organisms/Riwayat';

export default function Page() {
    return (
        <>
            <Navigation />
            <div className="container flex flex-col space-y-8 max-w-md mx-auto px-4">
                <h1 className="mt-4 text-left text-2xl font-bold text-[#363A36]">
                    Halo Zufar 👋
                </h1>
                <ProgressCard />
                <Riwayat />
            </div>
            <Footer />
        </>
    );
}
