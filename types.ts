
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'staff' | 'note';
  content: string;
  timestamp: Date;
  image?: {
    data: string;
    mimeType: string;
  };
}

export interface ChatSession {
  id: string;
  partnerName: string;
  lastMessage: string;
  lastTimestamp: Date;
  status: 'active' | 'waiting' | 'closed';
  unreadCount: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assignedAgent?: string;
  messages: Message[]; // 각 세션별 메시지 내역 추가
}

export interface Macro {
  id: string;
  title: string;
  content: string;
  category: string;
}

export enum SupportStatus {
  AI_CHAT = 'AI_CHAT',
  HUMAN_SUPPORT = 'HUMAN_SUPPORT',
  IDLE = 'IDLE'
}

export type ViewMode = 'partner' | 'staff';
