import { openSync, readSync, closeSync } from "node:fs";
import path from "node:path";

// Intrinsic width/height for self-hosted images, read from the file header at
// render time so <img> tags can carry width/height and reserve space before
// load (avoids layout shift). Only JPEG and PNG are parsed; anything else, or
// any remote URL, returns undefined and the tag simply renders without size
// attributes as before.
const cache = new Map<string, { width: number; height: number } | undefined>();

function localPath(src: string): string | undefined {
  const m = src.match(/^(?:https:\/\/rts\.fm)?(\/images\/[^?#]+)$/);
  return m ? path.join(process.cwd(), "public", decodeURIComponent(m[1])) : undefined;
}

function readDims(file: string): { width: number; height: number } | undefined {
  let fd: number | undefined;
  try {
    fd = openSync(file, "r");
    const head = Buffer.alloc(32);
    readSync(fd, head, 0, 32, 0);
    if (head.readUInt32BE(0) === 0x89504e47) {
      return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
    }
    if (head[0] === 0xff && head[1] === 0xd8) {
      // Walk JPEG segments until a start-of-frame marker.
      const buf = Buffer.alloc(1 << 16);
      const n = readSync(fd, buf, 0, buf.length, 0);
      let i = 2;
      while (i + 9 < n) {
        if (buf[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = buf[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
  } catch {
    /* missing file or unreadable header: render without dimensions */
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
  return undefined;
}

export function getImageDims(src: string | undefined) {
  if (!src) return undefined;
  if (cache.has(src)) return cache.get(src);
  const file = localPath(src);
  const dims = file ? readDims(file) : undefined;
  cache.set(src, dims);
  return dims;
}
