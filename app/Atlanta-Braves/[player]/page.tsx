"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function toFolderName(player: string) {
  return player.replace(/-/g, " ");
}

export default function PlayerPage() {
  const params = useParams();
  const player = params.player as string;
  const folderName = toFolderName(player);
  const imageFolder = `/Atlanta Braves/${folderName}`;
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/atlanta-braves-player-images?player=${encodeURIComponent(
        folderName
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      });
  }, [folderName]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{folderName} Cards</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {loading ? (
          <div
            style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}
          >
            <span
              style={{
                display: "inline-block",
                width: 40,
                height: 40,
                border: "4px solid #ccc",
                borderTop: "4px solid #333",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : images.length === 0 ? (
          <p>No images found.</p>
        ) : (
          images.map((img) => (
            <Image
              key={img}
              src={`${imageFolder}/${img}`}
              alt={`${folderName} card ${img}`}
              width={300}
              height={420}
              style={{ borderRadius: "8px", boxShadow: "0 2px 8px #aaa" }}
            />
          ))
        )}
      </div>
    </main>
  );
}
