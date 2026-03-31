import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from './chatSocketSingleton';

type UseChatSocketProps = {
  onNewMessage?: (message: any) => void;
  onNewConversation?: (message: any) => void;
  onNewMessageStatus?: (message: any) => void;
  onNewUserOnline?: (message: any) => void;
  onNewConversationStatus?: (message: any) => void;
};

export const useChatSocket = ({ onNewMessage,
  onNewConversation, onNewMessageStatus, onNewUserOnline, onNewConversationStatus }: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('🔌 Đã kết nối socket thành công!');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Đã ngắt kết nối socket');
      setIsConnected(false);
    };

    const handleNewMessage = (message: any) => {
      // console.log('📩 New message:', message);
      onNewMessage?.(message);
    };

    const handleNewConversation = (message: any) => {
      onNewConversation?.(message);
    };


    const handleNewMessageStatus = (message: any) => {
      onNewMessageStatus?.(message);
    };

    const handleNewUserOnline = (message: any) => {
      onNewUserOnline?.(message);
    };

    const handleConversationStatus = (message: any) => {
      onNewConversationStatus?.(message)
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('send_message', handleNewMessage);
    socket.on('send_conversation', handleNewConversation);
    socket.on('update_status', handleNewMessageStatus);

    socket.on('user_online', handleNewUserOnline);
    socket.on('send_conversation_status', handleConversationStatus);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('send_message', handleNewMessage);
      socket.off('send_conversation', handleNewConversation);
      socket.off('update_status', handleNewMessageStatus);
      socket.off('user_online', handleNewUserOnline);
      socket.off('send_conversation_status', handleConversationStatus);
    };
  }, []);

  const sendMessage = (data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data);
    }
  };

  const send_conversation_status = (data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_conversation_status', data);
    }
  }

  return {
    sendMessage,
    send_conversation_status,
    socket: socketRef.current,
    isConnected,
  };
};

