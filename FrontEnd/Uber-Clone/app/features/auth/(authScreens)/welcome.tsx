import '../../../../global.css'
import { router } from "expo-router"
import { useRef, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Swiper from 'react-native-swiper'
import  onboarding  from "../constance"

const Onboarding = () =>{

    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const isLastSlide = activeIndex === onboarding.length -1;

    return (
          <SafeAreaView className="flex h-full items-center justify-between bg-white">
            <TouchableOpacity onPress={() => router.push('/features/auth/(authScreens)/sign-up')}
            className="w-full flex justify-end items-end p-5"
                >
                <Text className="text-black text-md font-JakartaBold">
                    Skip
                </Text>
            </TouchableOpacity>
            <Swiper 
            ref={swiperRef}
            loop={false}
            dot={<View className="w-[15px] h-[15px] mx-1 bg-[#E2E8F0] rounded-full"/>}
            activeDot={<View className="w-[15px] h-[15px] mx-1 bg-[#0286FF] rounded-full"/>}
            onIndexChanged={(index) => setActiveIndex(index)}
            >
              {onboarding.map((item) =>(
                <View key={item.id} className="flex items-center justify-center p-5">
                     <Image
              source={item.image}
              className="w-full h-[280px]"
              resizeMode="contain"
            />
                    <Text className="text-black text-3xl font-bold mx-5 text-center">
                        {item.title}
                        </Text>
                     <Text className="text-md text-center text-[#858585] mx-10 mt-4">
              {item.description}
            </Text>
                </View>
              ))}
            </Swiper>
            {
                isLastSlide ? (<>
                <TouchableOpacity
      onPress={() => router.navigate('/features/auth/sign-up')}
      className={`w-full rounded-full p-3 flex flex-row justify-center items-center bg-[#0286FF] shadow-md shadow-neutral-400/70`}
    >
        <Text className='text-lg font-bold text-white'>Get Started</Text>
    </TouchableOpacity>
                </>)

                :
                  <TouchableOpacity
      onPress={() => swiperRef.current?.scrollBy(1)}
      className={`w-full rounded-full p-3 flex flex-row justify-center items-center bg-[#0286FF] shadow-md shadow-neutral-400/70`}
    >
        <Text className='text-lg font-bold text-white'>
            Next
        </Text>
    </TouchableOpacity>
                
            }
         
        </SafeAreaView>
    )
}

export default Onboarding