import { styled } from "@mui/material";

import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";

import { type Home } from "../hooks/useHomes";

import "./Map.css";
import {
  BathtubRounded,
  BedRounded,
  SquareFootRounded,
} from "@mui/icons-material";

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
        <p style={{ padding: "6px 8px", minWidth: 250 }}>
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
        </p>
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
