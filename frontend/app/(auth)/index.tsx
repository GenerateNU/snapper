import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../components/button';
import { router } from 'expo-router';

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Button text="Sign Up" onPress={() => router.push('/register')} />
      <Button text="Sign In" onPress={() => router.push('/login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Welcome;
