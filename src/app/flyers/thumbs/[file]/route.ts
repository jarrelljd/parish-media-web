import { readThumbnail } from "@/lib/flyers/store";

// Serves flyer thumbnails from the data folder. File names change whenever an
// image is replaced, so browsers can cache each one forever.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const img = await readThumbnail(file);
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
