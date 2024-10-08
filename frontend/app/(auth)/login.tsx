import React from 'react';
import {
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from 'react-native';
import LoginForm from './components/login-form';

const Login = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        <Text style={styles.welcomeText}>Login</Text>
        <Text>Dive in</Text>
        <LoginForm />
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    paddingTop: 120,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Login;