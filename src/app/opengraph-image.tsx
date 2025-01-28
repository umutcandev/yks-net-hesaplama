import { ImageResponse } from "next/og";
import { GeistSans } from "geist/font/sans";

export const runtime = "edge";

export const alt = "YKS Net Hesaplama";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          fontFamily: "Geist Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: 64, color: "black" }}>N</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <h1
              style={{
                fontSize: 64,
                color: "white",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                margin: 0,
                padding: 0,
              }}
            >
              YKS Net Hesaplama
            </h1>
            <p
              style={{
                fontSize: 32,
                color: "rgb(163 163 163)",
                margin: 0,
                padding: 0,
              }}
            >
              TYT ve AYT Net Hesaplama Aracı
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 