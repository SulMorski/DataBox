'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId")!=null?localStorage.getItem("userId"):sessionStorage.getItem("userId");
        console.log(userId);
        if (userId!=null)
            router.push('/main'); // jeśli już zalogowany to main
        else router.push('/login');
    }, [router]);
    return null;
}