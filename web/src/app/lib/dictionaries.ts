import en from "../dictionaries/en.json";
import pt from "../dictionaries/pt.json";

export type Dictionary = typeof pt;

// Força o en a respeitar a estrutura do pt (erro aparece aqui, com mensagem clara)
const dictionaries: Record<"en" | "pt", Dictionary> = {
  en,
  pt,
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale => {
  return locale in dictionaries;
};

export const getDictionary = (locale: Locale | string): Dictionary => {
  return hasLocale(locale) ? dictionaries[locale] : dictionaries.pt;
};