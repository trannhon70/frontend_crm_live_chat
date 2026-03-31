import { useState } from 'react';
import { toast } from 'react-toastify';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copy thành công!")
      setTimeout(() => setCopied(false), 2000); // Reset sau 2s
      return true;
    } catch (error) {
      console.error('Copy failed', error);
      setCopied(false);
      return false;
    }
  };

  return { copied, copy };
};
