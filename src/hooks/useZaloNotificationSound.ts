import { useEffect, useRef } from "react";

const useZaloNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);

  useEffect(() => {
    const audio = new Audio("/sounds/notication.mp3");
    audioRef.current = audio;

    // Preload để không bị request trễ
    audio.preload = "auto";

    const unlock = () => {
      if (!audioRef.current) return;
      audioRef.current.muted = true;
      audioRef.current.play().finally(() => {
        audioRef.current?.pause();
        if (audioRef.current) {
          audioRef.current.muted = false;
          audioRef.current.currentTime = 0;
        }
      });
      window.removeEventListener("click", unlock);
    };

    // unlock khi user click lần đầu
    window.addEventListener("click", unlock);

    return () => {
      window.removeEventListener("click", unlock);
    };
  }, []);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // chặn spam play nếu nhiều noti trong 300ms
    const now = Date.now();
    if (now - lastPlayedRef.current < 300) return;
    lastPlayedRef.current = now;

    try {
      audio.currentTime = 0;
      audio.play();
    } catch (err) {
      console.warn("🔇 Không thể phát âm thanh:", err);
    }
  };

  return { play };
};

export default useZaloNotificationSound;
