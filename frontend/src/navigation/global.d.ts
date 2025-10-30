// src/types/global.d.ts
declare global {
  interface Response {
    body: ReadableStream<Uint8Array> | null;
  }

  interface ReadableStreamDefaultReader {
    read(): Promise<{ done: boolean; value?: Uint8Array }>;
    releaseLock(): void;
  }

  const TextDecoder: {
    new (): { decode(input: Uint8Array): string };
  };
}