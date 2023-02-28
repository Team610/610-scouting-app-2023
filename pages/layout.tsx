import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SignIn, { checkAccount } from "./signIn";
import Link from "next/link";
import { getSession, signIn, signOut } from "next-auth/react";
import {
  GetServerSidePropsContext,
  NextComponentType,
  NextPageContext,
} from "next";
import { ReactNode } from "react";
import { addUser } from "../neo4j/User";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  avatar: {
    color: theme.colorScheme === "dark" ? "white" : "black",
  },
}));

export default function Layout({ children }: { children: ReactNode }) {
  // let auth = checkAccount();
  return (
    <>
      <HeaderMegaMenu />
      {children}
    </>
  );
}
// else {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         flexDirection: "column",
//         justifyContent: "center",
//       }}
//     >
//       <h1>Please Sign in With a Crescent School Email</h1>
//       <Button onClick={() => signIn("google")}>Sign In</Button>
//     </div>
//   );
// }

export function HeaderMegaMenu() {
  const { classes, theme } = useStyles();

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%", color: "black" }}>
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/match" className={classes.link}>
              Match
            </Link>
            <Link href="/teams" className={classes.link}>
              Teams
            </Link>
            <Link href="/data" className={classes.link}>
              Data
            </Link>
            <Link
              href={""}
              onClick={() => signIn("google")}
              className={classes.link}
            >
              Sign Out
            </Link>
          </Group>

          <Group className={classes.avatar}>
            <SignIn />
          </Group>
        </Group>
      </Header>
    </Box>
  );
}
