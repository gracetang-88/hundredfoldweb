import { Language } from '@/types';

export const languages: Language[] = ['en', 'zh'];

export const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '中文',
};

export const defaultLanguage: Language = 'en';
