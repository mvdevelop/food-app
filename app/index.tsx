import React, { Fragment } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { offers } from "@/constants";
import { OfferArraySchema } from "@/src/schemas/food";

// ──────────────────────────────────────────────────────────────
// Home Screen — Food Offers List
// ──────────────────────────────────────────────────────────────
// Security: Static data is validated at runtime via Zod schema (OfferArraySchema)
// to prevent injection attacks and data type confusion, even though
// the data is bundled with the app. This implements defense-in-depth
// (OWASP ASVS V5.1: Input Validation).
//
// Logging: All console.log calls are guarded by __DEV__ to prevent
// accidental PII or debug data leakage in production builds (CWE-532).

// Validate static data at module load — fail fast if data is corrupted
const validatedOffers = OfferArraySchema.parse(offers);

export default function Index() {
  const handleOfferPress = (item: { title: string }) => {
    // Security: Only log offer title in development mode.
    // In production, this would trigger analytics or navigation.
    if (__DEV__) {
      console.log("Offer pressed:", item.title);
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        data={validatedOffers}
        renderItem={({ item }) => (
          <View>
            <Pressable
              className="offer-card"
              style={{ backgroundColor: item.color }}
              onPress={() => handleOfferPress(item)}
            >
              <Fragment>
                <View className="h-full w-1/2">
                  <Image source={item.image} className="size-full" resizeMode="contain" />
                </View>

                <View className="offer-card__info">
                  <Text className="text-white font-quicksand-bold text-xl">{item.title}</Text>
                </View>
              </Fragment>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
