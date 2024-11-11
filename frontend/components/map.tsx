import React, { Component, useEffect, useRef } from 'react';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';

class Map extends Component {
  INITIAL_REGION = {
    latitude: 37.33,
    longitude: -122,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  state = {
    x: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  };

  render() {
    return (
      <>
        <View style={{ flex: 1 }}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={this.INITIAL_REGION}
          >
            <Marker
              draggable
              coordinate={this.state.x}
              onDragEnd={(e) =>
                this.setState({
                  x: {
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  },
                })
              }
            />
          </MapView>
        </View>
      </>
    );
  }
}

export default Map;
