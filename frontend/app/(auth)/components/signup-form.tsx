import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';

type SignupFormData = {
    name: string;
    email: string;
    password: string;
};

const SIGNUP_SCHEMA = z
    .object({
        name: z.string().min(2, {
            message: 'First name must be at least 2 characters long'
        }),
        email: z
            .string()
            .email({ message: 'Must be a valid email' }),
        password: z
            .string()
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number'
            })
            .regex(/[^A-Za-z0-9]/, {
                message: 'Password must contain at least one special character'
            })
            .min(8, { message: 'Password must be at least 8 characters long' })
    })

    
const SignUpForm = () => {
    const {
        control,
        handleSubmit,
        trigger,
        formState: { isValid, errors }
    } = useForm<SignupFormData>({
        resolver: zodResolver(SIGNUP_SCHEMA),
        mode: 'onTouched'
    });
    
    const onSignUpPress = async (signupData: SignupFormData) => {
        try {
            const validData = SIGNUP_SCHEMA.parse(signupData);
            console.log({ validData });
            // router.push('/(app)');
        } catch (err: any) {
            if (err instanceof ZodError) {
                Alert.alert(err.errors[0].message);
            } else {
                Alert.alert(err.errors[0].message);
            }
        }
    };
    
    return (
            <View style={styles.container}>
            <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Input
                            onChangeText={(text: string) => {
                                onChange(text);
                                trigger('name');
                            }}
                            value={value}
                            title="Name"
                            placeholder="Enter your name"
                            error={errors.name && errors.name.message}
                        />
                    </>
                )}
            />
            <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Input
                            onChangeText={(text: string) => {
                                onChange(text);
                                trigger('email');
                            }}
                            value={value}
                            title="Email"
                            placeholder="Enter your email"
                            error={errors.email && errors.email.message}
                        />
                    </>
                )}
            />
            <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Input
                            onChangeText={(text: string) => {
                                onChange(text);
                                trigger('password');
                            }}
                            secureTextEntry
                            value={value}
                            title="Password"
                            placeholder="Enter your password"
                            error={errors.password && errors.password.message}
                        />
                    </>
                )}
            />
            <Button text="Sign up" onPress={handleSubmit(onSignUpPress)}/>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SignUpForm;