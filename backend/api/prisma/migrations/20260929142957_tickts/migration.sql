-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'OCCUPIED');

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,
    "clientId" INTEGER,
    "email" VARCHAR(150),
    "phone" VARCHAR(20),
    "pricePaid" DECIMAL(10,2) NOT NULL,
    "state" "TicketState" NOT NULL DEFAULT 'RESERVED',
    "qrCode" VARCHAR(500) NOT NULL,
    "barcode" VARCHAR(100),
    "controlNumber" VARCHAR(50) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentReference" VARCHAR(100),
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validationDate" TIMESTAMP(3),
    "validatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_qrCode_key" ON "Ticket"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_barcode_key" ON "Ticket"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_controlNumber_key" ON "Ticket"("controlNumber");

-- CreateIndex
CREATE INDEX "Ticket_sessionId_idx" ON "Ticket"("sessionId");

-- CreateIndex
CREATE INDEX "Ticket_seatId_idx" ON "Ticket"("seatId");

-- CreateIndex
CREATE INDEX "Ticket_state_idx" ON "Ticket"("state");

-- CreateIndex
CREATE INDEX "Ticket_controlNumber_idx" ON "Ticket"("controlNumber");

-- CreateIndex
CREATE INDEX "Ticket_purchaseDate_idx" ON "Ticket"("purchaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_sessionId_seatId_key" ON "Ticket"("sessionId", "seatId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionMovie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
