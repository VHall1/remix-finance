import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.transaction.updateMany({
  where: { currency: null },
  data: { currency: "GBP" },
});

console.log("Done!");
