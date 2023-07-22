import { Card } from "@mui/material";

import "leaflet/dist/leaflet.css";
import marker from "leaflet/dist/images/marker-icon.png";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map() {
  const position = { lat: 51.505, lng: -0.09 };

  return (
    <Card sx={{ flex: 2, display: "block" }}>
      <MapContainer style={{ width: "100%", height: "100%" }} center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Card>
  );
}
