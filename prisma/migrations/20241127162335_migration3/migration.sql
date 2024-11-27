-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Customer', 'Admin', 'Organizer');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('CANCELLED', 'AWAIT_LISTING', 'LIST');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role"[],
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" SERIAL NOT NULL,
    "eventBannerUrl" TEXT NOT NULL,
    "eventOrganiser" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "longitude" INTEGER,
    "latitude" INTEGER,
    "locationArea" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "EventStatus" DEFAULT 'CANCELLED',
    "eventcreatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TicketCategories" (
    "ticketCategoriesId" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "TicketCategories_pkey" PRIMARY KEY ("ticketCategoriesId")
);

-- CreateTable
CREATE TABLE "eventDate" (
    "eventDateId" SERIAL NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "dateId" INTEGER NOT NULL,

    CONSTRAINT "eventDate_pkey" PRIMARY KEY ("eventDateId")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticketId" SERIAL NOT NULL,
    "eventTicketId" INTEGER NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticketId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventcreatorId_fkey" FOREIGN KEY ("eventcreatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCategories" ADD CONSTRAINT "TicketCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventDate" ADD CONSTRAINT "eventDate_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventTicketId_fkey" FOREIGN KEY ("eventTicketId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
