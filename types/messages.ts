// src/types/messages.ts

// 消息请求类型
export interface MessageRequest {
  action: 'convertPage' | 'convertSelection';
  selectionText?: string;
  url?: string;
}

// 消息响应类型
export interface MessageResponse {
  markdown?: string;
  metadata?: {
    title: string;
    url: string;
    date: string;
    author?: string;
  } | null;
  error?: string;
  success?: boolean;
}

// 通知类型（用于 service-worker）
export interface NotificationOptions {
  title: string;
  message: string;
}