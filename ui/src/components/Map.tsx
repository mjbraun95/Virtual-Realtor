import { forwardRef } from "react";
import { Card } from "@mui/material";

import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Map as IMap } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import { Home } from "../hooks/useHomes";
import { HomeMarker } from "./Home";

import "./Map.css";

interface MapProps {
  homes: Home[]
}

const Map = forwardRef<IMap, MapProps>(({ homes }, ref) => {
  const position = { lat: 53.55014, lng: -113.46871 };

  return (
    <Card sx={{ flex: 1, display: "block", boxShadow: "none" }}>
      <MapContainer
        ref={ref}
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
          {homes.map((home) => (
            <HomeMarker key={home.uuid} home={home} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </Card>
  );
});

export default Map;
