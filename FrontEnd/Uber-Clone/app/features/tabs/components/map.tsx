import React, { useEffect, useRef, useState } from "react";
import { useDriverStore, useLocationStore, useRidePriceTime } from "@/app/features/tabs/store";
import { calculateRegion, generateMarkersFromData } from "@/app/features/lib/map";
import { View, Platform, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Driver, MarkerData } from "@/app/features/tabs/types/types";
import { useFetch } from "../../lib/fetch";

const LEBANON_CENTER = {
  latitude: 33.8547,
  longitude: 35.8623,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const Map = () => {
  const { userLatitude, userLongitude, destinationLatitude, destinationLongitude } = useLocationStore();
  const { selectedDriver, setSelectedDriver, setDrivers } = useDriverStore();
  const { setRidePrice, setRideTime } = useRidePriceTime();
  const { data: drivers, loading, error } = useFetch<Driver[]>("/features/(api)/drivers");

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView>(null);

  // Generate driver markers
  useEffect(() => {
    if (!Array.isArray(drivers) || !userLatitude || !userLongitude) return;

    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });
    setMarkers(newMarkers);
    setDrivers(newMarkers);
  }, [drivers, userLatitude, userLongitude, setDrivers]);

  // Fetch route & calculate price/time
  useEffect(() => {
    const fetchRoute = async () => {
      if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude || markers.length === 0)
        return;

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceMeters = route.distance;
          const durationSeconds = route.duration;

          // Price calculation
          const baseFare = 3;
          const perKm = 1;
          const perMin = 0.2;
          const price = baseFare + (distanceMeters / 1000) * perKm + (durationSeconds / 60) * perMin;

          setRidePrice(Number(price.toFixed(2)));
          setRideTime(Number((durationSeconds / 60).toFixed(0)));

          setRouteCoords(
            route.geometry.coordinates.map(([lon, lat]: [number, number]) => ({
              latitude: lat,
              longitude: lon,
            }))
          );
        }
      } catch (err) {
        console.error("OSRM route error:", err);
      }
    };

    fetchRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude, markers, setRidePrice, setRideTime]);

  const region = calculateRegion({
    userLatitude: userLatitude ?? LEBANON_CENTER.latitude,
    userLongitude: userLongitude ?? LEBANON_CENTER.longitude,
    destinationLatitude: destinationLatitude ?? LEBANON_CENTER.latitude,
    destinationLongitude: destinationLongitude ?? LEBANON_CENTER.longitude,
  });

  const normalizeNumber = (value: number | string | null | undefined): number | null => {
    if (typeof value === "number") return isNaN(value) ? null : value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  };

  const safeMarkers: MarkerData[] = (markers || []).map((m) => ({
    ...m,
    latitude: normalizeNumber(m.latitude) ?? LEBANON_CENTER.latitude,
    longitude: normalizeNumber(m.longitude) ?? LEBANON_CENTER.longitude,
  })).filter((m) => typeof m.latitude === "number" && typeof m.longitude === "number");

  if (loading || !userLatitude || !userLongitude)
    return (
      <View className="flex justify-center items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-center items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      style={{ width: "100%", height: "100%" }}
      mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
      showsUserLocation
      showsPointsOfInterest={false}
      initialRegion={region}
      userInterfaceStyle="light"
    >
      {/* Driver markers */}
      {safeMarkers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}
          title={marker.title}
          image={selectedDriver === marker.id ? require("@/assets/icons/selected-marker.png") : require("@/assets/icons/marker.png")}
          onPress={() => setSelectedDriver(marker.id)}
        />
      ))}

      {/* Destination marker */}
      {normalizeNumber(destinationLatitude) && normalizeNumber(destinationLongitude) && (
        <Marker
          key="destination"
          coordinate={{ latitude: normalizeNumber(destinationLatitude) as number, longitude: normalizeNumber(destinationLongitude) as number }}
          title="Destination"
          image={require("@/assets/icons/pin.png")}
        />
      )}

      {/* Draw route */}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#0286FF" />
      )}
    </MapView>
  );
};

export default Map;
