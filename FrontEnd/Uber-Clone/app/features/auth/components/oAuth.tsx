import { Image, Text, TouchableOpacity, View } from "react-native";

const OAuth = () =>{

    return (
        <View>
             <View className="flex flex-row justify-center items-center mt-2 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">OR</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <TouchableOpacity className="rounded-full border border-gray-300 p-3 m-2">
        <View  className="flex flex-row items-center justify-center">
            <Image 
             source={require("@/assets/icons/google.png")}
             resizeMode='cover'
            className="w-5 h-5 mx-2"
            />
            <Text className="text-md">Log In with Google</Text>
        </View>
    </TouchableOpacity>
        </View>
    )

}

export default OAuth;