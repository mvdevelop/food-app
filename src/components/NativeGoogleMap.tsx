import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { restaurants } from "@/src/data/marketplace";

export function NativeGoogleMap() {
  const region = {
    latitude: -23.5614,
    longitude: -46.656,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      className="flex-1"
      accessibilityLabel="Mapa de restaurantes"
    >
      <Marker
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
        title="Seu endereço"
        pinColor="#f97316"
      />
      {restaurants.map((restaurant, index) => (
        <Marker
          key={restaurant.id}
          coordinate={{
            latitude: region.latitude + (index + 1) * 0.002,
            longitude: region.longitude + (index - 1) * 0.002,
          }}
          title={restaurant.name}
          description={restaurant.deliveryTime}
        />
      ))}
    </MapView>
  );
}
