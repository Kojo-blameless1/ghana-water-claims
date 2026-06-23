-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "staffNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TravelVoucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TravelVoucher" ("accountCode", "activity", "allowanceMonth", "byAir", "byRail", "createdAt", "date", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "itineraryEntries", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount") SELECT "accountCode", "activity", "allowanceMonth", "byAir", "byRail", "createdAt", "date", "district", "employee", "hotelActual", "hotelNights", "hotelPerNight", "id", "itineraryEntries", "miscellaneous", "post", "privateVehicleMiles", "privateVehicleRate", "purpose", "tolls", "totalAmount" FROM "TravelVoucher";
DROP TABLE "TravelVoucher";
ALTER TABLE "new_TravelVoucher" RENAME TO "TravelVoucher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_staffNo_key" ON "User"("staffNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
