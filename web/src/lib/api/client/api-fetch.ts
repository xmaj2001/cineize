// import { authClient } from "@/lib/auth/auth-client";
import { ApiNetworkError } from "../api-error";
import { parseApiResponse } from "../parse-response";
// TODO: aponta isto para o teu client real do Better Auth
// (ex: export const authClient = createAuthClient({ ... }))

const API_URL = process.env.NEXT_PUBLIC_URL || "";

/**
 * Fetch para chamar a partir de Client Components / hooks.
 *
 * Por padrão bate nas TUAS rotas Next (`/api/*`), que fazem de BFF e
 * reenviam o pedido para o NestJS (ver `server/proxy-fetch.ts`). Como
 * é same-origin com o Next, o cookie da sessão do Better Auth viaja
 * sozinho com `credentials: "include"`.
 *
 * Como estás em BFF, esse cookie é criado para o domínio do Next —
 * mas se algum dia este mesmo fetch precisar de bater direto no
 * NestJS (outro domínio) o cookie pode não chegar (cross-site /
 * 3rd-party cookie). Por isso também anexamos, como rede de
 * segurança, um `Authorization: Bearer` com o token da sessão que o
 * client do Better Auth já tem em memória — assim o pedido continua
 * autenticado mesmo que o cookie não sobreviva à travessia.
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // const token = await getClientSessionToken();
  // if (token && !headers.has("Authorization")) {
  //   headers.set("Authorization", `Bearer ${token}`);
  // }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/${url}`, {
      ...options,
      credentials: "include",
      headers,
    });
  } catch (error) {
    throw new ApiNetworkError(
      `Falha ao comunicar com o BFF: ${error instanceof Error ? error.message : "erro de rede"}`,
    );
  }

  return parseApiResponse<T>(response, "apiFetch");
}

// async function getClientSessionToken(): Promise<string | null> {
//   try {
//     const { data } = await authClient.getSession();
//     return data?.session?.token ?? null;
//   } catch {
//     // Sem sessão ainda (ex: utilizador não autenticado) — segue sem Bearer,
//     // o endpoint decide se exige autenticação ou não.
//     return null;
//   }
// }
