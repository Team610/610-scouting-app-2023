import Image from "next/image";
import cone from "styles/img/cone.png";
import cube from "styles/img/cube.png";

export default function GamePiece({ gamePiece }: { gamePiece: string }) {
  return (
    <>
      <p
        style={{
          fontSize: "16px",
          color: "white",
        }}
      >
        You have {gamePiece === "nothing" ? "nothing" : ""}
      </p>
      {gamePiece !== "nothing" ? (
        <Image
          src={gamePiece == "cone" ? cone : cube}
          width={30}
          alt="gamepiece"
        />
      ) : null}
    </>
  );
}
