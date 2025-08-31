"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CorbinCarrollPage() {
  const imageFolder = "/Diamondbacks/Corbin Carroll";
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/diamondbacks-corbin-images")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
      });
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Arizona Diamondbacks - Corbin Carroll</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {images.length === 0 ? (
          <p>No images found.</p>
        ) : (
          images.map((img) => (
            <Image
              key={img}
              src={`${imageFolder}/${img}`}
              alt={`Corbin Carroll card ${img}`}
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
