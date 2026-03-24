import crypto from "crypto";

export function generateToken() {
  return crypto.randomBytes(32).toString("hex"); // raw token
}

export function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}