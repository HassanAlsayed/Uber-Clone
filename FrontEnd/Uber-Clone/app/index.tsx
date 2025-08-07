
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If already signed in → go to home
//   if (isSignedIn) {
//   return <Redirect href='/features/tabs/(tabsScreens)/home' />;  }

//   // If not signed in → go to welcome/login
   return <Redirect href='/features/auth/(authScreens)/welcome' />;
}