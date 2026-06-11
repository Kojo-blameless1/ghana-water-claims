/*
  Warnings:

  - You are about to drop the column `approvedDate` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `claimant` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `ddo` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `ddoDate` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `districtHead` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `districtHeadDate` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `receivedDate` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `receivedDay` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `receivedMonth` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `receivedSum` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `receivedYear` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `receiverSignature` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `regionalChief` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `regionalChiefDate` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `sectionalHead` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `sectionalHeadDate` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `witness` on the `TravelVoucher` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TravelVoucher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "activity" TEXT,
    "purpose" TEXT NOT NULL,
    "allowanceMonth" TEXT NOT NULL,
    "hotelNights" INTEGER,
    "hotelPerNight" REAL,
    "hotelActual" REAL,
    "byAir" REAL,
    "byRail" REAL,
    "privateVehicleMiles" INTEGER,
    "privateVehicleRate" REAL,
    "tolls" REAL,
    "miscellaneous" REAL,
    "totalAmount" REAL NOT NULL,
    "accountCode" TEXT,
    "date" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TravelVoucher" ("accountCode", "activity", "allowanceMonth", "byAir", "byRail", "createdAt", "date", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount") SELECT "accountCode", "activity", "allowanceMonth", "byAir", "byRail", "createdAt", "date", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount" FROM "TravelVoucher";
DROP TABLE "TravelVoucher";
ALTER TABLE "new_TravelVoucher" RENAME TO "TravelVoucher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
