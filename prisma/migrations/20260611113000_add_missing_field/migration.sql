/*
  Warnings:

  - You are about to drop the column `directAir` on the `TravelVoucher` table. All the data in the column will be lost.
  - You are about to drop the column `directRail` on the `TravelVoucher` table. All the data in the column will be lost.

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
    "claimant" TEXT,
    "ddo" TEXT,
    "districtHead" TEXT,
    "sectionalHead" TEXT,
    "regionalChief" TEXT,
    "witness" TEXT,
    "approvedDate" TEXT,
    "receivedDate" TEXT,
    "receivedSum" TEXT,
    "receiverSignature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TravelVoucher" ("activity", "allowanceMonth", "createdAt", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount") SELECT "activity", "allowanceMonth", "createdAt", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount" FROM "TravelVoucher";
DROP TABLE "TravelVoucher";
ALTER TABLE "new_TravelVoucher" RENAME TO "TravelVoucher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
