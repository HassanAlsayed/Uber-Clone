import { useAuth, useUser } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { fetchAPI } from "@/app/features/lib/fetch";
import { useLocationStore } from "@/app/features/tabs/store";
import { PaymentProps } from "@/app/features/tabs/types/types";
import { router } from "expo-router";


const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const { userId } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);
  const { user } = useUser();

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      try {
        await fetchAPI("/features/(api)/ride/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin_address: userAddress,
            destination_address: destinationAddress,
            origin_latitude: userLatitude,
            origin_longitude: userLongitude,
            destination_latitude: destinationLatitude,
            destination_longitude: destinationLongitude,
            ride_time: Math.round(rideTime),
            fare_price: Math.round(amount * 100),
            payment_status: "paid",
            driver_id: driverId,
            user_id: userId,
            created_at: new Date().toISOString()
          }),
        });
      } catch (e) {
        console.warn("Failed to create ride record", e);
      }
      setSuccess(true);
    }
  };

  const initializePaymentSheet = async () => {
    // 1) Create PaymentIntent + Customer + Ephemeral Key on server
    const { paymentIntent, ephemeralKey, customer } = await fetchAPI(
      "/features/(api)/(stripe)/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.username,
          email,
          amount: amount,
        }),
      },
    );
    // 2) Initialize PaymentSheet on client
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey.secret,
      paymentIntentClientSecret: paymentIntent.client_secret,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: { name: fullName || undefined, email },
      returnURL: "uberclone://book-ride",
      
    
    });

    if (error) {
      Alert.alert("Payment init failed", error.message);
    }
  };

  return (
    <>
      <View className="mx-3 mt-5 bg-[#3B82F6] rounded-2xl items-center">
        <TouchableOpacity
          onPress={openPaymentSheet}
        >
          <Text className="text-white text-md p-3">Select Ride</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={require('@/assets/images/check.png')} className="w-28 h-28 mt-5" />

          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>

          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for your booking. Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>

          <View className="mx-3 mt-5 bg-[#3B82F6] rounded-2xl items-center">
            <TouchableOpacity
              onPress={() => router.push('/features/tabs/(tabsScreens)/home')}
            >
              <Text className="text-white text-md p-3">Back to home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Payment;