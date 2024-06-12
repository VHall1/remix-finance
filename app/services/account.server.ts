import { addAccountSchema } from "~/schemas/account";
import { db } from "~/utils/db.server";

export function addAccount(
  userId: string,
  { name, balance }: typeof addAccountSchema._type
) {
  return db.account.create({
    data: { name, balance: Math.floor(balance * 100), userId },
  });
}
