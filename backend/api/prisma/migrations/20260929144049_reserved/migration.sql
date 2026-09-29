/*
  Warnings:

  - The values [OCCUPIED] on the enum `SeatStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SeatStatus_new" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');
ALTER TABLE "public"."Seat" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Seat" ALTER COLUMN "status" TYPE "SeatStatus_new" USING ("status"::text::"SeatStatus_new");
ALTER TYPE "SeatStatus" RENAME TO "SeatStatus_old";
ALTER TYPE "SeatStatus_new" RENAME TO "SeatStatus";
DROP TYPE "public"."SeatStatus_old";
ALTER TABLE "Seat" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
