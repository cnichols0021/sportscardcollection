import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const imagesDir = path.join(
    process.cwd(),
    "public",
    "Diamondbacks",
    "Corbin Carroll"
  );
  let images: string[] = [];
  try {
    images = fs
      .readdirSync(imagesDir)
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
  } catch (err) {
    // Folder may not exist or be empty
    images = [];
  }
  return NextResponse.json({ images });
}
