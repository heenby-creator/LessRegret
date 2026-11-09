import { ImageResponse } from "next/og";
import { getCard } from "@/lib/cards";
import { categoryMeta } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LessRegret";

export default function CardOgImage({ params }: { params: { id: string } }) {
  const card = getCard(params.id);
  const dusk = card?.category === "career";
  const hook = card?.hook.en ?? "From the regrets of long lives.";
  const label = card ? categoryMeta[card.category].label.en : "LessRegret";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: dusk ? "#14181F" : "#FDFBF7",
          color: dusk ? "#F6F1E8" : "#2C2825",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6 }}>LESSREGRET</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 24, color: "#8C5A3C" }}>{label}</div>
          <div style={{ display: "flex", fontSize: 58, lineHeight: 1.15, maxWidth: 980 }}>{hook}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24 }}>lessregret.life</div>
      </div>
    ),
    { ...size },
  );
}
