import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import Chat from "../components/Chat";
import Map from "../components/Map";
import HomeList from "../components/Home";
import useHomes, { type HomesFilters } from "../hooks/useHomes";
import { useEffect, useState } from "react";
import Filters from "../components/Filters";

export default function Home() {
  const [filters, setFilters] = useState<HomesFilters>({
    property_type: null, // ["Single Family"],
    max_price: null,
    min_price: null,
    min_bedrooms: null,
    max_bedrooms: null,
    min_bathrooms: null,
    max_bathrooms: null,
    min_storeys: null,
    max_storeys: null,
    min_land_size: null,
    max_land_size: null,
    building_type: null, //["House", "Duplex"],
    ownership: null, // ["Freehold", "Condominium/Strata"]
  });
  const { homes, loading: homesLoading } = useHomes(filters);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading && !homesLoading) {
      setLoading(false);
    }
  }, [loading, homesLoading])

  if (loading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Connecting you to the future of real estate...
        </Typography>
      </Box>
    );
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
        <Chat setFilters={setFilters} />

        <Stack direction="column" flex={2} height="95vh" position="relative">
          <Filters filters={filters} onUpdate={setFilters} />

          <Map homes={homes ?? []} />
          <HomeList homes={homes ?? []} />
        </Stack>
      </Stack>
    </Container>
  );
}
