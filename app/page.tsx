"use client";
import { useEffect, useState } from "react";

const CLOUDINARY_CLOUD_NAME = "dmkavnadn";
const CLOUDINARY_API_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

async function fetchTeamsPlayersImages() {
  const res = await fetch("/api/cloudinary-folders");
  if (!res.ok) return { teams: [], playersByTeam: {}, imagesByPlayer: {} };
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
  const [imagesByPlayer, setImagesByPlayer] = useState<
    Record<string, Record<string, string[]>>
  >({});
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchTeamsPlayersImages().then(
      ({ teams, playersByTeam, imagesByPlayer }) => {
        setTeams(teams);
        setPlayersByTeam(playersByTeam);
        setImagesByPlayer(imagesByPlayer);
        if (teams.length > 0 && playersByTeam[teams[0]]?.length > 0) {
          setSelectedTeam(teams[0]);
          setSelectedPlayer(playersByTeam[teams[0]][0]);
        }
        // Debug log
        console.log("Teams:", teams);
        console.log("PlayersByTeam:", playersByTeam);
        console.log("ImagesByPlayer:", imagesByPlayer);
      }
    );
  }, []);

  useEffect(() => {
    if (selectedTeam && selectedPlayer && imagesByPlayer[selectedTeam]) {
      setImages(imagesByPlayer[selectedTeam][selectedPlayer] || []);
    } else {
      setImages([]);
    }
    // Debug log
    console.log("Selected team:", selectedTeam);
    console.log("Selected player:", selectedPlayer);
    console.log("Images:", imagesByPlayer[selectedTeam]?.[selectedPlayer]);
  }, [selectedTeam, selectedPlayer, imagesByPlayer]);

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
            {teams.map((team: string) => (
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
            {(playersByTeam[selectedTeam] || []).map((player: string) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((url: string, idx: number) => (
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
