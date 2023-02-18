import { Avatar, Button } from "@mantine/core";
import { getSession, useSession, signIn } from "next-auth/react";

export default function SignIn() {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar src={session.user?.image} />
        <p>{session.user?.name}</p>
      </div>
    );
  }

  return (
    <Button variant="default" onClick={() => signIn("google")}>
      Sign In
    </Button>
  );
}

export function checkAccount() {
  const { data: session, status } = useSession();
  return session?.user?.email?.includes("@crescentschool.org");
}
