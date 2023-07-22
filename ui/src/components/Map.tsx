import { Card } from "@mui/material";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Home {
  id: number;
  address: string;
  price: number;
  lat: number;
  lng: number;
}

interface HomeProps {
  home: Home;
}

function Home({ home }: HomeProps) {
  return (
    <Marker position={{ lat: home.lat, lng: home.lng }}>
      <Popup>
        {home.address}
        <br />${home.price}
      </Popup>
    </Marker>
  );
}

export default function Map() {
  const position = { lat: 53.55014, lng: -113.46871 };
  const homes: Home[] = [
    {
      id: 0,
      address: "441 That St.",
      price: 325500,
      lat: 53.45014,
      lng: -113.46871,
    },
    {
      id: 1,
      address: "5231 102 Ave.",
      price: 550000,
      lat: 53.56014,
      lng: -113.46881,
    },
  ];

  return (
    <Card sx={{ flex: 2, display: "block" }}>
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

        {homes.map((home) => (
          <Home key={home.id} home={home} />
        ))}
      </MapContainer>
    </Card>
  );
}
