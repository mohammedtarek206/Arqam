'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TracksRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/courses');
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
