-- CreateEnum
CREATE TYPE "Format" AS ENUM ('TWOD', 'THREED', 'FOURD', 'MAX');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('NORMAL', 'VIP', 'ACCESSIBILITY');

-- CreateEnum
CREATE TYPE "ExhibitionType" AS ENUM ('PREVENDA', 'EXIBICAO_NORMAL', 'REEXIBICAO', 'ESPECIAL', 'IMAX_EXCLUSIVE', 'LIVE_EVENT');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('PREVENDA', 'NORMAL');

-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('DISPONIVEL', 'LOTADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TicketState" AS ENUM ('RESERVED', 'CONFIRMED', 'VALIDATED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'PAY_RURAL', 'PIX');

-- CreateEnum
CREATE TYPE "NotificationMethod" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'PARTIAL', 'ERROR');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CINEMA_MANAGER', 'CASHIER', 'VIEWER');

-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "Hall" (
    "id" SERIAL NOT NULL,
    "cinemaId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "format" "Format" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "images" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "hallId" INTEGER NOT NULL,
    "row" CHAR(1) NOT NULL,
    "number" INTEGER NOT NULL,
    "seatType" "SeatType" NOT NULL DEFAULT 'NORMAL',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exhibition" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "type" "ExhibitionType" NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exhibition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionMovie" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "hallId" INTEGER NOT NULL,
    "exhibitionId" INTEGER,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "currentOccupancy" INTEGER NOT NULL DEFAULT 0,
    "state" "SessionState" NOT NULL DEFAULT 'DISPONIVEL',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hall_cinemaId_idx" ON "Hall"("cinemaId");

-- CreateIndex
CREATE INDEX "Hall_format_idx" ON "Hall"("format");

-- CreateIndex
CREATE UNIQUE INDEX "Hall_cinemaId_number_key" ON "Hall"("cinemaId", "number");

-- CreateIndex
CREATE INDEX "Seat_hallId_idx" ON "Seat"("hallId");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_hallId_row_number_key" ON "Seat"("hallId", "row", "number");

-- CreateIndex
CREATE INDEX "Exhibition_movieId_idx" ON "Exhibition"("movieId");

-- CreateIndex
CREATE INDEX "Exhibition_type_idx" ON "Exhibition"("type");

-- CreateIndex
CREATE INDEX "Exhibition_active_idx" ON "Exhibition"("active");

-- CreateIndex
CREATE INDEX "Exhibition_startDate_idx" ON "Exhibition"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Exhibition_movieId_type_startDate_key" ON "Exhibition"("movieId", "type", "startDate");

-- CreateIndex
CREATE INDEX "SessionMovie_movieId_idx" ON "SessionMovie"("movieId");

-- CreateIndex
CREATE INDEX "SessionMovie_hallId_idx" ON "SessionMovie"("hallId");

-- CreateIndex
CREATE INDEX "SessionMovie_exhibitionId_idx" ON "SessionMovie"("exhibitionId");

-- CreateIndex
CREATE INDEX "SessionMovie_startDateTime_idx" ON "SessionMovie"("startDateTime");

-- CreateIndex
CREATE INDEX "SessionMovie_active_idx" ON "SessionMovie"("active");

-- CreateIndex
CREATE UNIQUE INDEX "SessionMovie_hallId_startDateTime_key" ON "SessionMovie"("hallId", "startDateTime");

-- AddForeignKey
ALTER TABLE "Hall" ADD CONSTRAINT "Hall_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibition" ADD CONSTRAINT "Exhibition_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionMovie" ADD CONSTRAINT "SessionMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionMovie" ADD CONSTRAINT "SessionMovie_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionMovie" ADD CONSTRAINT "SessionMovie_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
