import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../../components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../../components/button';
import { z, ZodError } from 'zod';
import { router } from 'expo-router';

type LoginFormData = {
    email: string;
    password: string;
};

const LOGIN_SCHEMA = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(1, { message: 'Password required' })
});
    
const LoginForm = () => {
    const {
        control,
        handleSubmit,
        trigger,
        formState: { isValid, errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(LOGIN_SCHEMA),
        mode: 'onTouched'
    });
    
    const onSignUpPress = async (signupData: LoginFormData) => {
        try {
            const validData = LOGIN_SCHEMA.parse(signupData);
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

export default LoginForm;