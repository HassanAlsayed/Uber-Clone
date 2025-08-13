import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import RideLayout from "@/app/features/tabs/components/rideLayout";
import { useLocationStore } from "@/app/features/tabs/store";
import LocationSearch from "./components/locationSearch";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Ride" snapPoints={['85%']}>
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

      <View className="my-3">

        <TextInput
         editable={false}
         value={userAddress ?? ''}
        className="bg-[#f0f0f0] py-3 px-1  rounded-2xl text-md "
        />
      </View>
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

      <View className="my-3">

            <TextInput
            editable={false}
            value={destinationAddress ?? ''}
            className="bg-[#f0f0f0] py-3 px-1 rounded-2xl text-md "
            />
      </View>

      <TouchableOpacity
        onPress={() => router.push('/features/tabs/confirmRide')}
       style={{ backgroundColor: "#3B82F6", padding: 12, borderRadius: 8, alignItems: "center" }}>
            <Text className="text-white text-md">Find Now</Text>
            </TouchableOpacity>
    </RideLayout>
  );
};

export default FindRide;