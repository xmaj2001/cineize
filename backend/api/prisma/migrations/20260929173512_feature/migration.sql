-- CreateTable
CREATE TABLE "FeaturedMovie" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "cinemaId" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "headline" VARCHAR(150),
    "bannerUrl" VARCHAR(500),
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeaturedMovie_active_startsAt_endsAt_idx" ON "FeaturedMovie"("active", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "FeaturedMovie_cinemaId_idx" ON "FeaturedMovie"("cinemaId");

-- CreateIndex
CREATE INDEX "FeaturedMovie_movieId_idx" ON "FeaturedMovie"("movieId");

-- AddForeignKey
ALTER TABLE "FeaturedMovie" ADD CONSTRAINT "FeaturedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedMovie" ADD CONSTRAINT "FeaturedMovie_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
