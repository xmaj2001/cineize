import en from "../dictionaries/en.json";
import pt from "../dictionaries/pt.json";

const dictionaries = {
  en,
  pt,
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof pt;

export const hasLocale = (locale: string): locale is Locale => {
  return locale in dictionaries;
};

export const getDictionary = (locale: Locale | string): Dictionary => {
  if (locale in dictionaries) {
    return dictionaries[locale as Locale];
  }
  return dictionaries.pt;
};