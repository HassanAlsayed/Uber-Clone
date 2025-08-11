import { Platform, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { useDriverStore, useLocationStore } from "../store";
import { calculateRegion } from "../../lib/map";
import { MarkerData } from "../types/types";
import { useState } from "react";


const drivers: MarkerData[] = [
  {
    id: 1,
    first_name: "James",
    last_name: "Wilson",
    title: "James Wilson",  // <-- add this
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: 4.8,
    latitude: 33.8547,
    longitude: 35.8623,
  },
  {
    id: 2,
    first_name: "David",
    last_name: "Brown",
    title: "David Brown", // <-- add this
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    car_seats: 5,
    rating: 4.6,
    latitude: 33.8647,
    longitude: 35.8723,
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Johnson",
    title: "Michael Johnson", // <-- add this
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    car_seats: 4,
    rating: 4.7,
    latitude: 33.8747,
    longitude: 35.8823,
  },
  {
    id: 4,
    first_name: "Robert",
    last_name: "Green",
    title: "Robert Green", // <-- add this
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    car_seats: 4,
    rating: 4.9,
    latitude: 33.8847,
    longitude: 35.8923,
  },
];
const Map = () => {

     const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  // Default Lebanon region for map
const LEBANON_CENTER = {
  latitude: 33.8547,
  longitude: 35.8623,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

  const region = calculateRegion({
    userLatitude: userLatitude ?? LEBANON_CENTER.latitude,
    userLongitude: userLongitude ?? LEBANON_CENTER.longitude,
    destinationLatitude: destinationLatitude ?? LEBANON_CENTER.latitude,
    destinationLongitude: destinationLongitude ?? LEBANON_CENTER.longitude,
  });

  const [markers,setMarkers] = useState<MarkerData[]>(drivers);
   const {selectedDriver,setDrivers } = useDriverStore();

  return (
     <View style={{ flex: 1 }}>
        <MapView
       // provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation={true}
        showsPointsOfInterest={false}
        mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
        userInterfaceStyle="light"
        >
            {markers.map((marker) =>(
                <Marker 
                key={marker.id}
                coordinate={{
                    latitude:marker.latitude,
                    longitude:marker.longitude
                }}
                title={marker.title}
                image={selectedDriver === marker.id ? require('@/assets/icons/selected-marker.png') : require('@/assets/icons/marker.png')}
                ></Marker>
            ))}
        </MapView>
    </View>
  );
};

export default Map;
