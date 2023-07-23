import "./Map.css";

import { Box, Card, CardActionArea, Typography, styled } from "@mui/material";
import {
  BathtubRounded,
  BedRounded,
  SquareFootRounded,
} from "@mui/icons-material";

import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";

import { Home } from "../hooks/useHomes";

const ImagePreview = styled("img")({
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  margin: 0,
  borderRadius: 4,
});

const PopupContents = styled("div")({
  width: "100%",
  height: "100%",

  borderRadius: 4,
  backgroundColor: "white",
  marginTop: -16,

  position: "relative",
});

const InfoGutter = styled("div")({
  display: "flex",
  width: "100%",
  paddingTop: 4,
});

interface HomeProps {
  home: Home;
}

export function HomeDetails({ home }: HomeProps) {
  const [addrPrimary, addrSecondary] = home.full_address.split("|");

  const fMoney = (price: number): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

    return formatter.format(price);
  };

  const fArea = (area: number): string => {
    const formatted = Math.round(area * 10) / 10;
    return formatted.toString() + " m²";
  };

  return (
    <>
      <ImagePreview src={home.photo} />
      <PopupContents>
        <Typography
          variant="body2"
          style={{ padding: "6px 8px", minWidth: 250 }}
        >
          <b>{addrPrimary}</b>
          <br />
          <i>{addrSecondary}</i>
          <br />
          <InfoGutter>
            <span className="price">{fMoney(home.price)}</span>

            <div style={{ flex: 1 }} />

            <span className="area">
              <SquareFootRounded />
              {fArea(home.size_interior)}
            </span>
            <span className="beds">
              <BedRounded sx={{ mr: 1 }} />
              {home.bedrooms}
            </span>
            <span className="baths">
              <BathtubRounded sx={{ mr: 1 }} />
              {home.bathrooms}
            </span>
          </InfoGutter>
        </Typography>
      </PopupContents>
    </>
  );
}

export function HomeMarker({ home }: HomeProps) {
  const position = { lat: home.latitude, lng: home.longitude };

  if (!position.lat || !position.lng) {
    console.log(position, home);
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>
        <HomeDetails home={home} />
      </Popup>
    </Marker>
  );
}

interface HomeListProps {
  homes: Home[],
}

export default function HomeList({ homes }: HomeListProps) {
  return (
    <Card
      sx={{
        display: "inline-flex",
        overflowX: "scroll",
        overflowY: "visible",
        boxShadow: "none",
        maxWidth: "60vw",
        height: 290,
        pt: 1,
      }}
    >
      {homes.map((home) => (
        <Card key={home.uuid} sx={{ mr: 1, minWidth: 275 }} variant="outlined">
          <CardActionArea onClick={() => console.log("TODO")}>
            <HomeDetails home={home} />
            <Box height={9} />
          </CardActionArea>
        </Card>
      ))}
    </Card>
  );
}
