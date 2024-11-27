import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Seed Users
  const users = Array.from({ length: 10 }).map((_, i) => ({
    firstName: `UserFirst${i + 1}`,
    secondName: `UserSecond${i + 1}`,
    lastName: `UserLast${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: hashedPassword,
    roles: i % 2 === 0 ? [Role.Customer] : [Role.Organizer], // Use the Role enum
    phoneNumber: `070000000${i + 1}`,
  }));

  await prisma.user.createMany({ data: users });

  // Seed Events
  // Seed Events
  const events = Array.from({ length: 10 }).map((_, i) => ({
    eventBannerUrl: `https://example.com/banner${i + 1}.jpg`,
    eventOrganiser: `Organizer${i + 1}`,
    eventName: `Event${i + 1}`,
    longitude: 36 + i,
    latitude: -1 - i,
    locationArea: `Location${i + 1}`,
    description: `Description for Event${i + 1}`,
    eventcreatorId: i + 1, // Link to a user as the creator
  }));

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // Seed Ticket Categories
  const ticketCategories = [];
  for (let i = 1; i <= 10; i++) {
    ticketCategories.push(
      {
        category: "VIP",
        price: 2000,
        categoryId: i,
      },
      {
        category: "Regular",
        price: 1000,
        categoryId: i,
      }
    );
  }

  await prisma.ticketCategories.createMany({ data: ticketCategories });

  // Seed Event Dates
  const eventDates = [];
  for (let i = 1; i <= 10; i++) {
    eventDates.push(
      {
        eventDate: new Date(`2024-12-${10 + i}`),
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        dateId: i,
      },
      {
        eventDate: new Date(`2024-12-${20 + i}`),
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        dateId: i,
      }
    );
  }

  await prisma.eventDate.createMany({ data: eventDates });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
