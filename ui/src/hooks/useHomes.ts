import { useCallback, useEffect, useMemo, useState } from "react";

export interface Home {
  full_address: string;
  latitude: number;
  longitude: number;
  uuid: string;
  size_interior: number;
  stories: number;
  building_type: string;
  price: number;
  parking_type: string;
  ammenities: string;
  photo: string;
  ammenities_nearby: string;
  ownership_type: string;
  url: string;
  land_size: string;
  postal_code: string;
  province_name: string;
  bathrooms: string;
  bedrooms: string;
  remarks: string;
  property_type: string;
  ownership: string;
}

async function fetchAPI(route: string): Promise<object> {
  const res = await fetch(`http://localhost:8888${route}`, {
    headers: {
      "Content-Type": "application/JSON",
    },
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

export default function useHomes() {
  const [homes, setHomes] = useState<Home[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (valid) {
      return;
    }

    setValid(true);
    setLoading(true);
    fetchAPI("/homes/")
      .then((homes: object) => {
        setHomes(homes as Home[]);
        setError(null);
      })
      .catch((error: Error) => {
        setError(error.message);
        setHomes(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [homes, error, loading, valid]);

  const invalidate = useCallback(() => {
    setValid(false);
  }, []);

  return useMemo(
    () => ({
      loading,
      valid,
      homes,
      error,
      invalidate,
    }),
    [loading, valid, homes, error, invalidate],
  );
}
