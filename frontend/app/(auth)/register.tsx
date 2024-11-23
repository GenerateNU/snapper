import React from 'react';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';
import SignUpForm from './components/register-form';

const Register = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full px-7 pt-10">
          <Text className="mb-10 text-xl font-bold">Create an account</Text>
          <SignUpForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
