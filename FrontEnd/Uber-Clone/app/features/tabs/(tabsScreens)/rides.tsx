
import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "../../lib/fetch";
import { Ride } from "../types/types";
import RideCard from "../components/rideCard";


const Rides = () => {
  const { user } = useUser();

  const {
    data: recentRides,
    loading,
  } = useFetch<Ride[]>(`/features/(api)/ride/${user?.id}`);

  return (
    <SafeAreaView className="flex bg-white">
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
           <View className="flex justify-center items-center">
            {!loading ? (
            <>
                 <Image
                  source={require('@/assets/images/no-result.png')}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
            </>
            ) : (
                 <ActivityIndicator size='large' color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text className="text-2xl font-JakartaBold my-5">All Rides</Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Rides;
