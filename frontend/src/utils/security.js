// Password hashing with the browser's built-in Web Crypto API (PBKDF2 + a random salt).
// NOTE: this is a stand-in so passwords are never stored as plain text while the app
// has no backend. In Stage 7 the PHP API takes over with password_hash() / password_verify().

const encoder = new TextEncoder();

const toHex = (bytes) =>
  [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

export function createSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return toHex(bits);
}
