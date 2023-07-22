import { Container, Stack } from "@mui/material";

import Chat from "../components/Chat";
import Map from "../components/Map";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Stack display="flex" direction="row" height="95vh" width="100%" m={0} overflow="none">
        <Chat />
        <Map />
      </Stack>
    </Container>
  );
}
