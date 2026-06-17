/*
  Warnings:

  - You are about to drop the `Itinerary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Itinerary";
PRAGMA foreign_keys=on;

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
    "itineraryEntries" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TravelVoucher" ("accountCode", "activity", "allowanceMonth", "byAir", "byRail", "createdAt", "date", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount") SELECT "accountCode", "activity", "allowanceMonth", "byAir", "byRail", "createdAt", "date", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount" FROM "TravelVoucher";
DROP TABLE "TravelVoucher";
ALTER TABLE "new_TravelVoucher" RENAME TO "TravelVoucher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
