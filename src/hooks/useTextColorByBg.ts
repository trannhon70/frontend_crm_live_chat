import { useMemo } from "react";

/**
 * Hook xác định màu chữ (đen hoặc trắng) phù hợp với nền `color`
 * @param color Mã màu nền dạng HEX (vd: "#ffffff", "#abc")
 * @returns "black" hoặc "white"
 */
export function useTextColorByBg(color: string): "black" | "white" {
  return useMemo(() => {
    if (!color || typeof color !== "string") return "black";

    let hex = color.replace("#", "");

    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }

    if (hex.length !== 6) return "black"; // fallback nếu lỗi

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "black" : "white";
  }, [color]);
}
