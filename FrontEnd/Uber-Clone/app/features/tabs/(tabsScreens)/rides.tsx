import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import '@/global.css'

const Rides = () =>{

    return (
          <SafeAreaView className="flex-1 items-center justify-center bg-white">
         <Text className="text-xl font-bold text-red-500">
            Rides
        </Text>
        </SafeAreaView>
    )
}

export default Rides