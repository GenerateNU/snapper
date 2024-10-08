import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LoginForm from './components/login-form';

const Login = () => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Login</Text>
                <Text>Dive in</Text>
                <LoginForm />
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
    welcomeText: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default Login;
