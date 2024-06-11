import { compare, hash } from "@node-rs/bcrypt";

const SALT_ROUNDS = 10;

export function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string) {
  return compare(password, hash);
}
