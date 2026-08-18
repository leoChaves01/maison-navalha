/*
  Warnings:

  - A unique constraint covering the columns `[bookingCode]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "bookingCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_bookingCode_key" ON "Appointment"("bookingCode");

-- CreateIndex
CREATE INDEX "Appointment_phone_bookingCode_idx" ON "Appointment"("phone", "bookingCode");
