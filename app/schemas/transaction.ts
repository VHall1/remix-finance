import { $Enums } from "@prisma/client";
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive(),
  reference: z.string().optional(),
  direction: z.nativeEnum($Enums.TransactionDirection),
});
