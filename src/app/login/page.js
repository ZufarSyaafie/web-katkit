/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import LoginForm from '@/components/organisms/login';

export default function Page() {
    return (
        <>
            <div className="container max-w-md mx-auto px-4 mt-24">
                <LoginForm />
            </div>
        </>
    );
}
