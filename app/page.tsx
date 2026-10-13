import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/Board"), { ssr: false });
const HumanDepthScene = dynamic(() => import("@/components/HumanDepthScene"), { ssr: false });

export default function Home() {
  return (
    <>
      <HumanDepthScene />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Board />
      </div>
    </>
  );
}
