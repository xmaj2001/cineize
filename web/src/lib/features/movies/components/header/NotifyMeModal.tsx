"use client";

import { useState } from "react";
import { X, Bell, Mail, Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCreatePresaleSubscription } from "@/lib/features/presale-subscriptions/hooks/use-presale-subscription";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface NotifyMeModalProps {
  movieId: string;
  movieTitle: string;
  onClose: () => void;
  lang?: string;
}

export function NotifyMeModal({ movieId, movieTitle, onClose, lang: propLang }: NotifyMeModalProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreatePresaleSubscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !whatsapp) return;

    setError(null);
    mutate(
      { movieId, email: email || undefined, whatsapp: whatsapp || undefined },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setError(null);
        },
        onError: (error) => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel modal-animate w-full max-w-md mx-4 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold uppercase tracking-wider text-foreground">
                {dict.movies.notify_modal.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {movieTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending || isSuccess}
            className="rounded-full p-2 hover:bg-muted transition text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{dict.movies.notify_modal.success_title}</h3>
              <p className="text-sm text-muted-foreground">
                {dict.movies.notify_modal.success_message.replace("{movieTitle}", movieTitle)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="text-sm text-foreground/90 font-medium">
                {dict.movies.notify_modal.prompt}
              </div>

              <div className="flex flex-col gap-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {dict.movies.notify_modal.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={dict.movies.notify_modal.email_placeholder}
                      className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 rounded-full border border-border/60 bg-transparent px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:bg-muted"
                >
                  {dict.movies.notify_modal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isPending || (!email && !whatsapp)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{dict.movies.notify_modal.saving}</span>
                    </>
                  ) : (
                    <span>{dict.movies.notify_modal.confirm}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}