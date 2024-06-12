import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => hash(password, SALT_ROUNDS);

export const comparePassword = (password: string, hash: string) =>
  compare(password, hash);
