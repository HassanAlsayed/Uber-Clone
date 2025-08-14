//import { SignOutButton } from "@/components/SignOutButton";
import { useUser, SignedIn, SignedOut, useClerk } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { ActivityIndicator, FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "../components/rideCard";
import Map from "../components/map";
import * as Location from "expo-location"
import { useEffect, useState } from "react";
import { useLocationStore } from "../store";
import LocationSearch from "../components/locationSearch";
import { useFetch } from "../../lib/fetch";
import { Ride } from "../types/types";

const Home = () => {

  const { user } = useUser();
  const { signOut } = useClerk();
  const [hasPermissions, setHasPermissions] = useState(false);
  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const { data: recentRides } = useFetch<Ride[]>(user?.id ? `/features/(api)/ride/${user?.id}` : 'null')
  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHasPermissions(false);
          return;
        }
        setHasPermissions(true);

        const location = await Location.getCurrentPositionAsync();
        let addressText = 'Unknown Location';
        try {
          const address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (Array.isArray(address) && address.length > 0) {
            const first = address[0] as any;
            const name = first?.name ?? '';
            const region = first?.region ?? '';
            addressText = [name, region].filter(Boolean).join(', ');
          }
        } catch { }

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: addressText,
        });
      } catch (e) {
        console.warn('Location error', e);
      }
    };
    requestLocation();
  }, [])

  const loading = false;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/features/auth/(authScreens)/sign-in');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }

  const onLocationSelected = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push('/features/tabs/findRide');
  };
  return (
    <SafeAreaView className="bg-general-500">

      <FlatList
        data={recentRides?.slice(0, 2)}
        renderItem={({ item }) => <RideCard ride={item} />}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image source={require('@/assets/images/no-result.png')}
                  className="w-40 h-40"
                  alt="No Recent Rides Found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No Recent Rides Founds</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl capitalize font-JakartaExtraBold">
                Welcome{","} {user?.username} 👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white m-3"
              >
                <Image source={require('@/assets/icons/out.png')} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
            <LocationSearch onLocationSelect={onLocationSelected} />


            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Your Current Location
            </Text>
            <View className="bg-transparent h-[300px] w-full overflow-hidden rounded-xl">
              <Map />
            </View>


           {recentRides?.length! > 0 && ( <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>)}

          </>
        )}
      />

    </SafeAreaView>

  );
};

export default Home;