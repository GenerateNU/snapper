import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';
import SignUpForm from './components/signup-form';

const Signup = () => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text>Create your account</Text>
                <Text>Dive in - Start Your Ocean Adventure</Text>
                <SignUpForm />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30, 
    },
});

export default Signup;