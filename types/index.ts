export type Language = 'en' | 'zh';

export interface ContentData {
  title: string;
  content: string;
  [key: string]: any;
}

export interface ServiceCard {
  title: string;
  description: string;
  icon?: string;
}
