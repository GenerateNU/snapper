import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

interface MapProps {
  coordinate: number[];
  setCoordinate: React.Dispatch<React.SetStateAction<number[]>>; // type of setter function
}

const Map: React.FC<MapProps> = ({ coordinate, setCoordinate }) => {
  const [region, setRegion] = useState({
    latitude: coordinate[0],
    longitude: coordinate[1],
    latitudeDelta: 2,
    longitudeDelta: 2,
  });

  useEffect(() => {
    setRegion({
      latitude: coordinate[0],
      longitude: coordinate[1],
      latitudeDelta: 2,
      longitudeDelta: 2,
    });
  }, [coordinate]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
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
  );
};

export default Map;
