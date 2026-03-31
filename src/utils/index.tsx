import { useEffect, useState } from "react";



export const CheckRole = {
  ADMIN: 1,
  QUANLY: 2,
  TUVAN: 3,
  GOOGLE: 4,
}

// staff là nhân viên phòng khám, customer là khách hàng
export const SENDER_TYPE = {
  CUSTOMER: "customer",
  STAFF: "staff",
  AUTO: "auto",
  AI: "AI",
};


export const timeAgoFromUnix = (unixTimestamp: number) => {
  const now = Date.now();
  const past = unixTimestamp * 1000;
  const diff = now - past;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

// Component hiển thị thời gian động
export const TimeAgo = ({ unix }: { unix: number }) => {
  const [tick, setTick] = useState(Date.now());

  // Cập nhật lại khi quay lại tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTick(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cập nhật mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 60000); // mỗi 60s

    return () => clearInterval(interval);
  }, []);

  return <span>{timeAgoFromUnix(unix)}</span>;
};

//check os

export const CHECK_OS = {
  IOS: 'iOS',
  ANDROID: 'Android',
  WINDOWNS: 'Windows',
  MAC_OS: 'macOS'
}

export const CHECK_DEVICE = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop',

}

export const CHECK_BROWSER = {
  CHROME: 'Chrome',
  SAFARI: 'Safari',
  EDGE: 'Edge',
  FIREFOX: 'Firefox',

}

export function getTextColorByBg(color: string): "black" | "white" {
  if (!color || typeof color !== "string") return "black";
  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length !== 6) return "black";
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "black" : "white";
}

export const CHECK_FILE = {
  MP4: 'mp4',
  MP3: 'mp3',
  M4A: 'm4a',
}