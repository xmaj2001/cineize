import NotFoundClient from "@/components/NotFoundClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página Não Encontrada | cineIze Angola",
  description: "A página que procuras não existe.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <NotFoundClient 
      lang="pt"
      title="Página não encontrada"
      description="A página que procura não existe ou foi movida."
      button="Voltar ao início"
    />
  );
}
