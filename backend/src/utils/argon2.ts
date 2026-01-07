import argon2 from "argon2";

export async function argonHash(input: string): Promise<string> {
  try {
    const hash = await argon2.hash(input, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    return hash;
  } catch (error) {
    throw new Error("Error executing hashing function");
  }
}

export async function verifyArgonHash(
  plainText: string,
  storedHash: string
): Promise<boolean> {
  try {
    const isMacth: boolean = await argon2.verify(storedHash, plainText);
    return isMacth;
  } catch (error) {
    throw new Error("Error verifying hash");
  }
}
