import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { CatalogInput } from "../dto/create-movie.dto";

@Injectable()
export class ListComingSoonUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ limit, cursor }: CatalogInput) {
    const movies = await this.prisma.movie.findMany({
      where: {
        active: true,
        worldLaunchDate: { gt: new Date() },
        sessionMovies: { none: { active: true } },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        posterUrl: true,
        genres: true,
        durationMinutes: true,
        worldLaunchDate: true,
      },
      orderBy: { id: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const nextCursor = movies.length > limit ? movies.pop()!.id : undefined;
    const items = movies.map((movie) => ({
      ...movie,
      sessions: [],
    }));

    return { items, nextCursor };
  }
}
