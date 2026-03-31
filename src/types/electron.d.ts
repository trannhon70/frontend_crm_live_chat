export {};

declare global {
  interface Window {
    electronAPI?: {
      focusApp?: () => void;
      // Thêm các method khác nếu cần
    };
  }
}
