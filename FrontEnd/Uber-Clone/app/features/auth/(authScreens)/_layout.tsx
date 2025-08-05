import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function AuthLayout() {
  

  return (
      <Stack screenOptions={{headerShown:false}} >
        <Stack.Screen name="welcome" options={{title:'welcome'}}/>
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="sign-in" />
      </Stack>
  );
}
