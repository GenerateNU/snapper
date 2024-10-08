import React from 'react';
import {
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import SignUpForm from './components/register-form';

const Register = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        <Text>Create your account</Text>
        <Text>Dive in - Start Your Ocean Adventure</Text>
        <SignUpForm />
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});

export default Register;
