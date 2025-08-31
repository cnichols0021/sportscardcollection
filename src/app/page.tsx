import { useEffect, useState } from "react";

const CLOUDINARY_CLOUD_NAME = "dmkavnadn";
const CLOUDINARY_API_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

async function fetchTeamsAndPlayers() {
  const res = await fetch("/api/cloudinary-folders");
  if (!res.ok) return { teams: [], playersByTeam: {} };
  return res.json();
}

function getSampleImages(team: string, player: string) {
  // For demo, construct a few sample URLs
  return Array.from(
    { length: 8 },
    (_, i) =>
      `${CLOUDINARY_API_URL}/v1693440000/${team}/${player}/${player}_${(i + 2)
        .toString()
        .padStart(4, "0")}.png`
  );
}

export default function Home() {
  const [teams, setTeams] = useState<string[]>([]);
  const [playersByTeam, setPlayersByTeam] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchTeamsAndPlayers().then(({ teams, playersByTeam }) => {
      setTeams(teams);
      setPlayersByTeam(playersByTeam);
      if (teams.length > 0) {
        setSelectedTeam(teams[0]);
        setSelectedPlayer(playersByTeam[teams[0]][0]);
      }
      // Debug log
      console.log("Teams:", teams);
      console.log("PlayersByTeam:", playersByTeam);
    });
  }, []);

  useEffect(() => {
    if (selectedTeam && selectedPlayer) {
      setImages(getSampleImages(selectedTeam, selectedPlayer));
    }
    // Debug log
    console.log("Selected team:", selectedTeam);
    console.log("Players for selected team:", playersByTeam[selectedTeam]);
  }, [selectedTeam, selectedPlayer, playersByTeam]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">
        Cloudinary Sports Card Gallery
      </h1>
      <div className="mb-6 flex gap-4 flex-wrap">
        <label>
          Team:
          <select
            className="ml-2 p-1 border rounded"
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value);
              setSelectedPlayer(playersByTeam[e.target.value][0]);
            }}
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
        <label>
          Player:
          <select
            className="ml-2 p-1 border rounded"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            {(playersByTeam[selectedTeam] || []).map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <img
            key={url}
            src={url}
            alt={`${selectedPlayer} card ${idx + 2}`}
            className="rounded shadow"
            width={200}
            height={280}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
