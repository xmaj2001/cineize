// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Idiomas suportados pelo seu app
  locales: ["pt", "en"],
  
  // Idioma padrão caso a rota não especifique nenhum
  defaultLocale: "pt",
});