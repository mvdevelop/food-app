
import React, { Fragment } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { offers } from "@/constants";
import cn from 'clsx';
 
export default function Index() {
  return (
    <SafeAreaView>
      <FlatList 
        data={offers} 
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0; 

          return (
            <View>
              <Pressable className={cn("offer-card")} style={{ backgroundColor: item.color }}>
                {({ pressed }) => (
                  <Fragment>
                    <View className={'h-full w-1/2'}>
                      <Image source={item.image} className={'size-full'} resizeMode={"contain"} />
                    </View>

                    <View className={"offer-card__info"}>
                      <Text>
                        {item.title}
                      </Text>
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          )
        }} 
      />
    </SafeAreaView>
  );
}
