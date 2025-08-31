import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const player = searchParams.get("player");
  if (!player) {
    return NextResponse.json({ images: [] });
  }
  const imagesDir = path.join(
    process.cwd(),
    "public",
    "Boston Red Sox",
    player
  );
  let images: string[] = [];
  try {
    images = fs
      .readdirSync(imagesDir)
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
  } catch (err) {
    images = [];
  }
  return NextResponse.json({ images });
}
