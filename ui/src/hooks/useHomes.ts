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

async function fetchAPI(
  route: string,
  method: "get" | "post",
  body?: object,
): Promise<object> {
  const res = await fetch(`http://localhost:8888${route}`, {
    headers: {
      "Content-Type": "application/JSON",
    },
    method,
    body: body && JSON.stringify(body),
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

export type PropertyType = "Single Family";
export type BuildingType = "House" | "Duplex";
export type OwnershipType = "Freehold" | "Condominium/Strata";
export interface HomesFilters {
  property_type: PropertyType[];
  max_price: number;
  min_price: number;
  min_bedrooms: number;
  max_bedrooms: number;
  min_bathrooms: number;
  max_bathrooms: number;
  min_storeys: number;
  max_storeys: number;
  min_land_size: number;
  max_land_size: number;
  building_type: BuildingType[];
  ownership: OwnershipType[];
}

export default function useHomes(filters: HomesFilters) {
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
    fetchAPI("/homes/", "post", filters)
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
  }, [homes, error, loading, valid, filters]);

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
