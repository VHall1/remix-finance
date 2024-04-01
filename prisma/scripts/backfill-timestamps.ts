import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("Migrating users");
await prisma.user.updateMany({
  data: { createdAt: new Date(), updatedAt: new Date() },
});

console.log("Migrating transactions");
await prisma.transaction.updateMany({
  data: { createdAt: new Date(), updatedAt: new Date() },
});

console.log("Done!");