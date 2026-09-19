// Só tipos e classes de erro aqui — nada de fetchers.
// Isso evita que um import "solto" traga sem querer código server-only
// para dentro de um bundle de client (ou vice-versa).
// Para os fetchers, importa explicitamente de "./client" ou "./server".

export * from "./types";
export * from "./api-error";
