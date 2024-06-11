import { compare, hash } from "@node-rs/bcrypt";
import { loginSchema, signUpSchema } from "~/schemas/user";
import { db } from "./db.server";

export async function signUp({
  email,
  firstName,
  lastName,
  password,
}: typeof signUpSchema._type) {
  const passwordHash = await hashPassword(password);
  return db.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash,
    },
  });
}

export async function login({ email, password }: typeof loginSchema._type) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return user;
}

const SALT_ROUNDS = 10;

export function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string) {
  return compare(password, hash);
}
