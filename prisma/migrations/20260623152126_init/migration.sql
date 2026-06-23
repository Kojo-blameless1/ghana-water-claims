-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "staffNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelVoucher" (
    "id" SERIAL NOT NULL,
    "employee" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "activity" TEXT,
    "purpose" TEXT NOT NULL,
    "allowanceMonth" TEXT NOT NULL,
    "hotelNights" INTEGER,
    "hotelPerNight" DOUBLE PRECISION,
    "hotelActual" DOUBLE PRECISION,
    "byAir" DOUBLE PRECISION,
    "byRail" DOUBLE PRECISION,
    "privateVehicleMiles" INTEGER,
    "privateVehicleRate" DOUBLE PRECISION,
    "tolls" DOUBLE PRECISION,
    "miscellaneous" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "accountCode" TEXT,
    "date" TEXT,
    "itineraryEntries" TEXT NOT NULL DEFAULT '[]',
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryClaim" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "preparedBy" TEXT,
    "staffEntries" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SummaryClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_staffNo_key" ON "User"("staffNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "TravelVoucher" ADD CONSTRAINT "TravelVoucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
