-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('CAD', 'EUR', 'GBP', 'USD');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currency" "Currency";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultCurrency" "Currency" NOT NULL DEFAULT 'GBP';
