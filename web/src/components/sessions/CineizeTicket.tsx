"use client";

import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ApiSessionDetail, SessionSeat } from "@/lib/features/sessions";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface ExtendedSessionSeat extends SessionSeat {
  ticketCode?: string;
}

interface cineizeTicketProps {
  session: ApiSessionDetail;
  seats: ExtendedSessionSeat[];
  email?: string;
  whatsapp?: string;
  paymentMethod?: string;
  lang?: string;
}

export function CineizeTicket({
  session,
  seats,
  email,
  whatsapp,
  paymentMethod = "Multicaixa Express",
  lang: propLang,
}: cineizeTicketProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);

  // Formatação de datas e valores
  const formattedDate = useMemo(() => {
    if (!session?.startTime) return "";
    return new Date(session.startTime).toLocaleDateString(lang === "en" ? "en-US" : "pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [session?.startTime, lang]);

  const formattedTime = useMemo(() => {
    if (!session?.startTime) return "";
    return new Date(session.startTime).toLocaleTimeString(lang === "en" ? "en-US" : "pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [session?.startTime, lang]);

  const formatPrice = (val: number): string => {
    if (typeof val !== "number") return "0 AKZ";
    return new Intl.NumberFormat(lang === "en" ? "en-US" : "pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace("AOA", "AKZ");
  };

  return (
    <div className="flex flex-col items-center w-full my-2">

      {/* Visualização de Bilhetes */}
      <div className="cineize-tickets-container flex flex-col gap-6 w-full max-w-[380px]">
        {seats.map((seat: ExtendedSessionSeat, index: number) => {
          const code = seat.ticketCode || `CZ-${seat.id ? seat.id.slice(0, 8).toUpperCase() : "00000000"}`;
          const seatLabel = `${seat.row}${seat.number}`;
          const qrPayload = `cineIze|${session.id}|${code}|${seatLabel}`;

          return (
            <main
              key={seat.id || index}
              className="single-ticket bg-white text-black font-mono w-full p-6 shadow-xl rounded-sm border border-slate-200 relative select-none"
            >
              {/* Topo do Bilhete */}
              <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
                <div className="flex justify-center items-center space-x-1 mb-1">
                  <span className="text-2xl font-black tracking-tighter uppercase font-sans">
                    CINE<span className="text-zinc-900">IZE</span>
                  </span>
                </div>
                <p className="text-xs font-bold tracking-wider font-sans uppercase text-slate-800">
                  {session.room?.location?.name || "cineIze"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-sans mt-0.5">
                  {dict.sessions.ticket.entry_proof
                    .replace("{current}", String(index + 1))
                    .replace("{total}", String(seats.length))}
                </p>
              </div>

              {/* Informações do Filme */}
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {dict.sessions.ticket.movie}
                </span>
                <h2 className="text-xl font-black leading-tight uppercase font-sans text-black mt-0.5">
                  {session.movie?.title}
                </h2>
                <div className="text-[11px] mt-1 space-x-1 text-slate-700 font-sans">
                  <span>
                    {dict.sessions.ticket.rating} <strong>{session.movie?.ageRating}</strong>
                  </span>
                  <span>|</span>
                  <span>
                    {dict.sessions.ticket.format} <strong>{session.room?.format}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 font-sans">
                  {dict.sessions.ticket.duration} <strong>{session.movie?.durationMin} {dict.sessions.ticket.min}</strong>
                </div>
              </div>

              <div className="border-t border-black my-3" />

              {/* Bloco Sala / Assento */}
              <div className="grid grid-cols-2 gap-2 my-2 bg-slate-50 p-2 border border-slate-300 rounded">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {dict.sessions.ticket.room}
                  </span>
                  <span className="text-2xl font-black text-black font-sans leading-none">
                    {session.room?.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {dict.sessions.ticket.seat}
                  </span>
                  <span className="text-2xl font-black text-blue-900 font-sans leading-none">
                    {seatLabel}
                  </span>
                </div>
              </div>

              {/* Detalhes da Sessão */}
              <div className="space-y-1 my-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.session}</span>
                  <span className="font-bold">{formattedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.date}</span>
                  <span className="font-bold">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.row}</span>
                  <span className="font-bold">{seat.row}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.seat_number}</span>
                  <span className="font-bold">{seat.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.seat_type}</span>
                  <span className="font-bold uppercase">{seat.type}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-black my-3" />

              {/* Pagamento */}
              <div className="space-y-1 text-xs my-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.unit_price}</span>
                  <span className="font-bold text-sm">
                    {formatPrice(session.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 uppercase">{dict.sessions.ticket.payment}</span>
                  <span className="font-bold uppercase">{paymentMethod}</span>
                </div>
                {(email || whatsapp) && (
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>{dict.sessions.ticket.contact}</span>
                    <span className="truncate max-w-[180px] font-sans">
                      {email || whatsapp}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-black my-4" />

              {/* Validação QR + Barcode */}
              <div className="flex flex-col items-center justify-center space-y-3 pt-1">
                <div className="flex items-center justify-center space-x-4 w-full">
                  <div className="bg-white p-1.5 border border-slate-300 rounded">
                    <QRCodeSVG
                      value={qrPayload}
                      size={80}
                      level="M"
                      includeMargin={false}
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-16 flex items-end space-x-0.5 bg-white p-1">
                      {[
                        3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 2, 1, 2, 1, 3,
                        1, 4, 1, 2, 2, 1, 3, 1, 2,
                      ].map((width: number, idx: number) => (
                        <div
                          key={idx}
                          className="bg-black h-full"
                          style={{ width: `${width * 1.3}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] tracking-widest font-mono mt-1 font-bold">
                      {code}
                    </span>
                  </div>
                </div>

                <p className="text-[9px] text-center uppercase tracking-tight text-slate-500 font-sans">
                  {dict.sessions.ticket.validity_notice}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400 font-sans">
                {dict.sessions.ticket.rights}
              </div>
            </main>
          );
        })}
      </div>
    </div>
  );
}
