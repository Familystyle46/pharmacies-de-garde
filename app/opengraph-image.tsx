import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Croix pharmacie */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 16,
                height: 60,
                background: "#16a34a",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 60,
                height: 16,
                background: "#16a34a",
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Pharmacies de Garde
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
          }}
        >
          Trouvez une pharmacie ouverte près de chez vous
        </div>
        <div
          style={{
            marginTop: 32,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: "10px 28px",
            fontSize: 20,
            color: "white",
            fontWeight: 600,
          }}
        >
          pharmacies-de-garde.net
        </div>
      </div>
    ),
    size
  );
}
