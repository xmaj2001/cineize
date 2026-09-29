import { Injectable } from "@nestjs/common";
import { SessionState } from "src/generated/prisma/enums";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class FindSessionsByMovieSlugDaysSummaryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(slug: string) {
    const sessions = await this.prisma.sessionMovie.findMany({
      where: {
        movie: { slug },
        startDateTime: { gte: new Date() },
        active: true,
        state: SessionState.AVAILABLE,
      },
      select: { startDateTime: true },
      orderBy: { startDateTime: "asc" },
    });
    const dayMap = new Map<string, number>();
    sessions.forEach(({ startDateTime }) => {
      const dayKey = startDateTime.toISOString().split("T")[0];
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
    });
    return Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}
