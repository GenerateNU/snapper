import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

interface MapProps {
  coordinate: number[];
  setCoordinate: React.Dispatch<React.SetStateAction<number[]>>; // type of setter function
}

const Map: React.FC<MapProps> = ({ coordinate, setCoordinate }) => {
  return (
    <>
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: coordinate[0],
            longitude: coordinate[1],
            latitudeDelta: 2,
            longitudeDelta: 2,
          }}
        >
          <Marker
            draggable
            coordinate={{ latitude: coordinate[0], longitude: coordinate[1] }}
            onDragEnd={(e) =>
              setCoordinate([
                e.nativeEvent.coordinate.latitude,
                e.nativeEvent.coordinate.longitude,
              ])
            }
          />
        </MapView>
      </View>
    </>
  );
};

export default Map;
