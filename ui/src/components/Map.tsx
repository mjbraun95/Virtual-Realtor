import { Card, styled } from "@mui/material";

import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import useHomes, { type Home } from "../hooks/useHomes";

import "./Map.css";
import { BathtubRounded, BedRounded } from "@mui/icons-material";

const ImagePreview = styled('img')({
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  margin: 0,
  borderRadius: 4,
});

const PopupContents = styled('div')({
  width: "100%",
  height: "100%",

  borderRadius: 4,
  backgroundColor: "white",
  marginTop: -16,

  position: "relative",
});

const InfoGutter = styled('div')({
  display: "flex",
  width: "100%",
  paddingTop: 4,
});

interface HomeProps {
  home: Home;
}

function HomeMarker({ home }: HomeProps) {
  const position = { lat: parseFloat(home.latitude), lng: parseFloat(home.longitude) };

  if (!position.lat || !position.lng) {
    console.log(position, home)
    return null;
  }

  const [addrPrimary, addrSecondary] = home.full_address.split('|');

  const fMoney = (price: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    return formatter.format(price);
  };

  return (
    <Marker position={{ lat: parseFloat(home.latitude), lng: parseFloat(home.longitude) }}>
      <Popup>
        <ImagePreview src={home.photo} />
        <PopupContents>
          <p style={{ padding: "6px 8px", minWidth: 250 }}>
            <b>{addrPrimary}</b><br />
            <i>{addrSecondary}</i><br />
            <InfoGutter>
              <span className="price">{fMoney(home.price)}</span>

              <div style={{ flex: 1 }} />

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
      </Popup>
    </Marker>
  );
}

export default function Map() {
  const position = { lat: 53.55014, lng: -113.46871 };
  const { homes } = useHomes();

  return (
    <Card sx={{ flex: 2, display: "block", boxShadow: "none" }}>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={position}
        zoom={11}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup>
          {(homes ?? []).map((home) => (
            <HomeMarker key={home.uuid} home={home} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </Card>
  );
}
