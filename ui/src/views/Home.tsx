import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";

import Chat from "../components/Chat";
import Map from "../components/Map";
import HomeList from "../components/Home";
import useHomes from "../hooks/useHomes";

export default function Home() {
  const { homes, loading } = useHomes();

  if (loading) {
    return (
      <Box width="100vw" height="100vh" overflow="hidden" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Connecting you to the future of real estate...
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Stack
        display="flex"
        direction="row"
        height="95vh"
        width="100%"
        m={0}
        p={0}
        pt={1}
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
