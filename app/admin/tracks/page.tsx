'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTracksRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/courses-control');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
