/**
 * Generates a random hex string of the specified length.
 */
export function getRandomHexString(length = 8): string {
  const byteLength = Math.ceil(length / 2);
  const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength));

  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
}
