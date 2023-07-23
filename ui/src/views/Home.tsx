import { Container, Stack } from "@mui/material";

import Chat from "../components/Chat";
import Map from "../components/Map";
import HomeList from "../components/Home";
import useHomes from "../hooks/useHomes";

export default function Home() {
  const { homes } = useHomes();

  return (
    <Container maxWidth="lg">
      <Stack
        display="flex"
        direction="row"
        height="95vh"
        width="100%"
        m={0}
        p={0}
        overflow="none"
      >
        <Chat />

        <Stack direction="column" flex={2} height="95vh">
          <Map homes={homes ?? []} />
          <HomeList homes={homes ?? []} />
        </Stack>
      </Stack>
    </Container>
  );
}
