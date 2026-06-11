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
    "directAir" REAL,
    "directRail" REAL,
    "privateVehicleMiles" INTEGER,
    "privateVehicleRate" REAL,
    "tolls" REAL,
    "miscellaneous" REAL,
    "totalAmount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
