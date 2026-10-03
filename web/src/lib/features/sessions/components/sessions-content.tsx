import { Dictionary } from "@/app/lib/dictionaries";
import { groupSessionsByDay } from "../util";
import { SessionGrid } from "./grid/session-grid";
import { getMovieSessions } from "../queries";

interface SessionsContentProps {
  dict: Dictionary;
  lang: string;
  slug: string;
}

export async function SessionsContent({
  dict,
  lang,
  slug,
}: SessionsContentProps) {
  // TODO Tratar em caso de erro
  const res = await getMovieSessions(slug);
  // TODO Tratar em caso de vir vazio as sessões
  const grouped = groupSessionsByDay(res.data.items, lang, dict);
  return (
    <section id="sessions" className="py-2">
      <h2 className="text-lg font-display font-bold uppercase tracking-wider text-foreground mb-6 flex items-center gap-2">
        {dict.movies.sessions_list.title}
      </h2>
      <div className="flex flex-col gap-8">
        {Array.from(grouped.entries()).map(([dayLabel, daySessions]) => (
          <div key={dayLabel}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-mono font-bold text-foreground uppercase tracking-widest">
                {dayLabel}
              </h3>
              <span
                className="flex-1 dotted-x text-foreground/15"
                aria-hidden
              />
              <span className="text-[10px] font-mono text-muted-foreground">
                {daySessions.length}{" "}
                {daySessions.length > 1
                  ? dict.movies.sessions_list.session_many
                  : dict.movies.sessions_list.session_one}
              </span>
            </div>

           <SessionGrid sessions={daySessions} lang={lang} dict={dict} />
          </div>
        ))}
      </div>
    </section>
  );
}



// import { Suspense } from "react";
// import { getMovieSessionsDaysSummary } from "../../queries";
// import { DaySessionsSection } from "./day-sessions-section";

// interface SessionsContentProps {
//   dict: any;
//   lang: string;
//   slug: string;
// }

// function getDayLabel(
//   dateString: string,
//   lang: string,
//   dict: any,
// ): string {
//   const date = new Date(dateString);
//   const today = new Date();
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const dateKey = dateString;
//   const todayKey = today.toISOString().split("T")[0];
//   const tomorrowKey = tomorrow.toISOString().split("T")[0];

//   if (dateKey === todayKey) {
//     return dict.movies.sessions_list.today;
//   } else if (dateKey === tomorrowKey) {
//     return dict.movies.sessions_list.tomorrow;
//   }

//   const dayNames: Record<number, string> = {
//     0: dict.days.sunday,
//     1: dict.days.monday,
//     2: dict.days.tuesday,
//     3: dict.days.wednesday,
//     4: dict.days.thursday,
//     5: dict.days.friday,
//     6: dict.days.saturday,
//   };

//   const dayName = dayNames[date.getDay()] ?? "";
//   return `${dayName}, ${date.toLocaleDateString(
//     lang === "en" ? "en-US" : "pt-PT",
//     {
//       day: "numeric",
//       month: "short",
//     },
//   )}`;
// }

// async function SessionsContentInner({
//   dict,
//   lang,
//   slug,
// }: SessionsContentProps) {
//   const res = await getMovieSessionsDaysSummary(slug);
//   const days = res.data; // ✅ Agora funciona!

//   return (
//     <section id="sessoes" className="py-2">
//       <h2 className="text-lg font-display font-bold uppercase tracking-wider text-foreground mb-6">
//         {dict.movies.sessions_list.title}
//       </h2>

//       <div>
//         {days.length === 0 ? (
//           <p className="text-muted-foreground">
//             {dict.movies.sessions_list.no_sessions}
//           </p>
//         ) : (
//           days.map((day) => (
//             <DaySessionsSection
//               key={day.date}
//               slug={slug}
//               date={day.date}
//               dayLabel={getDayLabel(day.date, lang, dict)}
//               dict={dict}
//               lang={lang}
//             />
//           ))
//         )}
//       </div>
//     </section>
//   );
// }

// export function SessionsContent(props: SessionsContentProps) {
//   return (
//     <Suspense fallback={<div>A carregar sessões...</div>}>
//       <SessionsContentInner {...props} />
//     </Suspense>
//   );
// }
