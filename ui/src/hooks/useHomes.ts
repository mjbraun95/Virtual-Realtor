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
  property_type: null | PropertyType[]; max_price: null | number;
  min_price: null | number;
  min_bedrooms: null | number;
  max_bedrooms: null | number;
  min_bathrooms: null | number;
  max_bathrooms: null | number;
  min_storeys: null | number;
  max_storeys: null | number;
  min_land_size: null | number;
  max_land_size: null | number;
  building_type: null | BuildingType[];
  ownership: null | OwnershipType[];
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

    const filtersCleaned = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null) {
        filtersCleaned[key] = value;
      }
    }

    setValid(true);
    setLoading(true);
    fetchAPI("/homes/", "post", filtersCleaned)
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

  useEffect(invalidate, [filters, invalidate]);

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
