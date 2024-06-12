import { z } from "zod";

export const addAccountSchema = z.object({
  name: z.string(),
  balance: z.number(),
});
