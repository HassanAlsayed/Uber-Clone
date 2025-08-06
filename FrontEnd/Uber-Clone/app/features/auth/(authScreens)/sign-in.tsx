import { Link } from "expo-router";
import { useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import OAuth from "../components/oAuth";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className=" bg-white flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow:1}}
        >
          <View className="relative w-full">
            <Image
              source={require("@/assets/images/signup-car.png")}
              className="z-0 w-full h-[250px]"
              resizeMode='cover'
              style={{ width: '100%' }}
            />
                <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Welcome 👋
            </Text>
          </View>

          <View className="p-2">
           <View className="flex flex-row items-center bg-gray-100 rounded-full px-4  mb-4">
                <Icon name="email" size={24} color="grey" />
                <TextInput
             placeholder="Email"
              value={form.email}
              onChangeText={(value) =>
                setForm((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
              textContentType='emailAddress'
              className={`rounded-full p-4 font-JakartaSemiBold text-[15px]
                    flex-1  text-left`}
            />
            </View>
          <View className="flex flex-row items-center bg-gray-100 rounded-full px-4  mb-4">
            <Icon name="lock" size={24} color="grey" />
             <TextInput
             placeholder="Password"
              value={form.password}
              secureTextEntry={true}
              onChangeText={(value) =>
                setForm((prev) => ({
                  ...prev,
                  password: value,
                }))
              }
              textContentType='password'
              className={`rounded-full p-4 font-JakartaSemiBold text-[15px]
                    flex-1 text-left `}
            />
           </View>
          </View>
           <TouchableOpacity
      //onPress={handleSignOut}
      className="bg-primary-500 p-4 rounded-full mx-2"
    >
      <Text className="text-white text-md text-center font-semibold">Sign In</Text>
    </TouchableOpacity>
    <OAuth />
   <Link href={'/features/auth/(authScreens)/sign-up'}
   className="text-lg text-center text-general-200 mt-2"
   >
   <Text>Don't Have an Account?</Text>
   <Text className="text-primary-500"> Sign Up</Text>
   </Link>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
