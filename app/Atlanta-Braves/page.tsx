import fs from "fs";
import path from "path";
import Link from "next/link";

export default function AtlantaBravesPage() {
  let players: string[] = [];
  try {
    const playersDir = path.join(process.cwd(), "public", "Atlanta Braves");
    players = fs.readdirSync(playersDir).filter((name) => {
      const fullPath = path.join(playersDir, name);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch (err) {
    players = [];
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Atlanta Braves</h1>
      <ul>
        {players.map((player) => (
          <li key={player} style={{ marginBottom: "0.5rem" }}>
            <Link href={`/Atlanta-Braves/${player.replace(/ /g, "-")}`}>
              {player}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
