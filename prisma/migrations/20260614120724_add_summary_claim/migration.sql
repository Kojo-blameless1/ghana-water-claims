-- CreateTable
CREATE TABLE "TravelVoucher" (
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

-- CreateTable
CREATE TABLE "SummaryClaim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "preparedBy" TEXT,
    "staffEntries" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
