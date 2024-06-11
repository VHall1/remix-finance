import { PrismaClient } from "@prisma/client";
import { singleton } from "~/utils/singleton.server";

function getClient() {
  const client = new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "info", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });

  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect();
  return client;
}

export const db = singleton("db-client", getClient);
