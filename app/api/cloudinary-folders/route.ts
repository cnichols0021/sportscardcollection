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
    const teams = teamFolders.folders.map((f: any) => f.name);
    const playersByTeam: Record<string, string[]> = {};
    const imagesByPlayer: Record<string, Record<string, string[]>> = {};
    await Promise.all(
      teams.map(async (team) => {
        try {
          const playerFolders = await cloudinary.v2.api.sub_folders(`${team}`);
          playersByTeam[team] = playerFolders.folders.map((f: any) => f.name);
          imagesByPlayer[team] = {};
          await Promise.all(
            playersByTeam[team].map(async (player) => {
              try {
                // List images in this player's folder
                const resources = await cloudinary.v2.api.resources({
                  type: "upload",
                  prefix: `${team}/${player}/`,
                  max_results: 30,
                });
                imagesByPlayer[team][player] = resources.resources.map(
                  (r: any) => r.secure_url
                );
              } catch (imgErr: any) {
                console.error(
                  `Error fetching images for ${team}/${player}:`,
                  imgErr.message
                );
                imagesByPlayer[team][player] = [];
              }
            })
          );
        } catch (playerErr: any) {
          console.error(
            `Error fetching player folders for team ${team}:`,
            playerErr.message
          );
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
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
