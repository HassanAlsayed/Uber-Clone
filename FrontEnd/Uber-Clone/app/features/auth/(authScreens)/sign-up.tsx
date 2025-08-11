  import { Link, router } from "expo-router";
  import { useState } from "react";
  import {
    Alert,
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
  import { useSignUp } from "@clerk/clerk-expo";
  import ReactNativeModal from "react-native-modal";
  import Toast from 'react-native-root-toast';
import { fetchAPI } from "../../lib/fetch";

  const SignUp = () => {
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
    });

    const [verification, setVerification] = useState({
      state: "default", 
      error: "",
      code: "",
    });

    const { isLoaded, signUp, setActive } = useSignUp();

    const onSignUpPress = async () => {
      if (!isLoaded) {
    return;
  }
      try {
        await signUp.create({
          emailAddress: form.email,
          password: form.password,
          username:form.name
        });
        
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setVerification({ ...verification, state: "pending", error: "" });
      } catch (err: any) {
        setVerification({
          ...verification,
          error: err?.errors?.[0]?.longMessage || "Failed to sign up.",
          state: "failed",
        });
        Alert.alert('Error',err?.errors?.[0]?.longMessage || "Failed to sign up.")
      }
    };

    const onVerifyPress = async () => {
      if (!isLoaded) return;
      try {
        const result = await signUp.attemptEmailAddressVerification({
          code: verification.code,
        });
        if (result.status === "complete") {
          await fetchAPI('/features/(api)/user',{
            method:'POST',
            body:JSON.stringify({
              name:form.name,
              email:form.email,
              clerkId: result.createdUserId
            }),
          })
          await setActive({ session: result.createdSessionId });
          setVerification({ ...verification, state: "success", error: "" });
        } else {
          setVerification({
            ...verification,
            error: "Verification failed. Please try again.",
            state: "failed",
          });
        Alert.alert('Error',"Verification failed. Please try again.")
        }
      } catch (err: any) {
        setVerification({
          ...verification,
          error: err?.errors?.[0]?.longMessage || "Verification error",
          state: "failed",
        });
        Alert.alert('Error',err?.errors?.[0]?.longMessage || "Verification error")
      }
    };


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
                resizeMode="cover"
                style={{ width: '100%' }}
              />
              <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                Create Your Account
              </Text>
            </View>

            <View className="p-1">
            <View className="flex flex-row items-center bg-gray-100 rounded-full px-4 mb-4">
              <Icon name='person' size={24} color={'grey'}/>
              <TextInput
              placeholder="Name"
                value={form.name}
                onChangeText={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
                keyboardType="default"
                className={`rounded-full p-4 font-JakartaSemiBold text-[15px]
                      flex-1  text-left`}
              />
            </View>
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
                keyboardType='email-address'
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
        onPress={onSignUpPress}
        className="bg-primary-500 p-4 rounded-full m-2"
      >
        <Text className="text-white text-md text-center font-semibold">Sign Up</Text>
      </TouchableOpacity>

            <OAuth />

    <Link href={'/features/auth/(authScreens)/sign-in'}
    className="text-lg text-center text-general-200 mt-2"
    >
    <Text>Already have account?</Text>
    <Text className="text-primary-500"> Log In</Text>
    </Link>
      <ReactNativeModal
            isVisible={verification.state === "pending"}
            onBackdropPress={() => setVerification({ ...verification, state: "default", error: "" })}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0.6}
            useNativeDriver={true}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">Verification</Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}.
              </Text>
              <View className="flex flex-row items-center bg-gray-100 rounded-full px-4  mb-4">
              <Icon name="lock" size={24} color="grey" />
              <TextInput
              placeholder="1234"
                value={verification.code}
                keyboardType="numeric"
                maxLength={6}
                onChangeText={(code) => setVerification({ ...verification, code })}
              />
            </View>
              <TouchableOpacity
                onPress={onVerifyPress}
                className="mt-5 bg-primary-500 rounded-full flex items-center"
                disabled={verification.code.length !== 6}
              >
                <Text className=" text-white py-3">Verify Email</Text>
                </TouchableOpacity>
            </View>
          </ReactNativeModal>

      <ReactNativeModal
            isVisible={verification.state === "success"}
            // onBackdropPress={() => router.push("/home")}
            // animationIn="fadeIn"
            // animationOut="fadeOut"
            // backdropOpacity={0.6}
            // useNativeDriver={true}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] justify-center items-center">
              <Image
                source={require('@/assets/images/check.png')}
                className="w-[110px] h-[110px] mb-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account.
              </Text>
            <TouchableOpacity onPress={() => router.push('/features/tabs/(tabsScreens)/home')}
                className="mt-5 bg-primary-500 rounded-full"
              >
              <Text className="text-white py-5 px-10 ">Browse Home</Text>
            </TouchableOpacity>
            </View>
          </ReactNativeModal>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  export default SignUp;
