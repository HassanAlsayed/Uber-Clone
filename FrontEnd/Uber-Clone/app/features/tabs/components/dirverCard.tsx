import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { DriverCardProps } from "../types/types";
import { useRidePriceTime } from "../store";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {

  const {ride_time,fare_price} = useRidePriceTime();
  return (
    <TouchableOpacity
      onPress={() => setSelected(item.id)}
      style={{
        backgroundColor: selected === item.id ? "#E8F0FE" : "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: item.profile_image_url }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
          resizeMode="cover"
        />
        <View style={{ marginLeft: 10 }}>
          {/* Rating */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Image
              source={require('@/assets/icons/star.png')}
              style={{ width: 14, height: 14, tintColor: "orange", marginRight: 4 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "600" }}>
              {(() => {
                const ratingNum = typeof item.rating === 'number' ? item.rating : parseFloat(String(item.rating ?? ''));
                return isNaN(ratingNum) ? '-' : ratingNum.toFixed(1);
              })()}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require('@/assets/icons/dollar.png')}
              style={{ width: 14, height: 14, marginRight: 3 }}
            />
            <Text style={{ fontSize: 12, color: "#555" }}>
              {fare_price.toFixed(2)}$
            </Text>

            <Text style={{ fontSize: 12, color: "#555" }}>|  {ride_time } min </Text>
            <Text style={{ fontSize: 12, color: "#555" }}>| {item.car_seats} seats</Text>
          </View>
        </View>
      </View>

      <Image
        source={{ uri: item.car_image_url }}
        style={{ width: 60, height: 40 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default DriverCard;