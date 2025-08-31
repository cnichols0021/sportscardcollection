import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // List all team folders under root
    const teamFolders = await cloudinary.v2.api.sub_folders("/");
    console.log("Team folders response:", JSON.stringify(teamFolders, null, 2));
    type CloudinaryFolder = { name: string };
    type CloudinaryResource = { secure_url: string };
    const teams = teamFolders.folders.map((f: CloudinaryFolder) => f.name);
    const playersByTeam: Record<string, string[]> = {};
    const imagesByPlayer: Record<string, Record<string, string[]>> = {};
    await Promise.all(
      teams.map(async (team: string) => {
        try {
          const playerFolders = await cloudinary.v2.api.sub_folders(`${team}`);
          playersByTeam[team] = playerFolders.folders.map(
            (f: CloudinaryFolder) => f.name
          );
          imagesByPlayer[team] = {};
          await Promise.all(
            playersByTeam[team].map(async (player: string) => {
              try {
                // List images in this player's folder
                const resources = await cloudinary.v2.api.resources({
                  type: "upload",
                  prefix: `${team}/${player}/`,
                  max_results: 30,
                });
                imagesByPlayer[team][player] = resources.resources.map(
                  (r: CloudinaryResource) => r.secure_url
                );
              } catch {
                imagesByPlayer[team][player] = [];
              }
            })
          );
        } catch {
          playersByTeam[team] = [];
          imagesByPlayer[team] = {};
        }
      })
    );
    return NextResponse.json({
      teams,
      playersByTeam,
      imagesByPlayer,
      debug: { teamFolders, playersByTeam, imagesByPlayer },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "API error", details: String(err) },
      { status: 500 }
    );
  }
}
