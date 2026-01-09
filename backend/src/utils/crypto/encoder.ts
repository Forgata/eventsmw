export function encode(input: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(input);
}
