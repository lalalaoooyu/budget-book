import { createContext, useContext } from 'react';
import translations from './translations';
import type { Lang } from './translations';

export const LangContext = createContext<Lang>('ja');

export function useLang() {
  const lang = useContext(LangContext);
  return { lang, t: translations[lang] };
}
