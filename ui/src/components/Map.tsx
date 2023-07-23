import { Card } from "@mui/material";

import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer } from "react-leaflet";

import useHomes from "../hooks/useHomes";

import "./Map.css";
import { HomeMarker } from "./Home";

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
