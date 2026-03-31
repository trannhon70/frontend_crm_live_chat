import { useEffect, useState } from 'react';

const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export const useCountDown = () => {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        const startTime = Number(localStorage.getItem('startTimeToken'));
        const endTime = Number(localStorage.getItem('endTimeToken'));

        if (!startTime || !endTime) {
            logout(); // token thiếu → logout ngay
            return;
        }

        const updateRemaining = () => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = endTime - now;

            if (remaining <= 0) {
                setRemainingSeconds(0);
                setIsExpired(true);
                logout();
            } else {
                setRemainingSeconds(remaining);
                setIsExpired(false);
            }
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);

        return () => clearInterval(interval);
    }, []);

    const logout = async() => {
        // Xoá token
        localStorage.clear();
        window.location.reload();
    };

    return {
        remainingSeconds,
        formattedTime: formatTime(remainingSeconds),
        isExpired,
    };
};
