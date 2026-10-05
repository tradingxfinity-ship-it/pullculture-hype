// Crop and shrink an uploaded image to a fixed size and return it as a JPEG
// data URL, small enough to keep in the demo account's local storage.
// Swap for a real upload (returning a hosted URL) once accounts exist.
export async function fitImage(file: File, width: number, height: number, quality = 0.85): Promise<string> {
  const bmp = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  // cover-crop around the centre
  const scale = Math.max(width / bmp.width, height / bmp.height);
  const w = bmp.width * scale;
  const h = bmp.height * scale;
  ctx.drawImage(bmp, (width - w) / 2, (height - h) / 2, w, h);
  bmp.close();
  return canvas.toDataURL("image/jpeg", quality);
}
