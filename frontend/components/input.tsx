import React, { forwardRef } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface TextInputProps {
    title?: string;
    placeholder?: string;
    error?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    inputMode?: 'text' | 'numeric' | 'tel' | 'search' | 'email';
    onChangeText?: (value: string) => void;
    value?: string;
    maxLength?: number;
    secureTextEntry?: boolean;
    children?: React.ReactNode;
}

const Input = forwardRef<TextInput, TextInputProps>(({
    title,
    placeholder,
    error,
    autoFocus,
    readOnly,
    inputMode,
    onChangeText,
    value,
    maxLength,
    secureTextEntry,
}, ref) => {
    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <TextInput
                ref={ref}
                style={[styles.input, error ? styles.error : {}]}
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
                autoFocus={autoFocus}
                editable={!readOnly}
                keyboardType={inputMode === 'numeric' ? 'numeric' : 'default'}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        fontSize: 16,
        marginBottom: 4,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    error: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    helperText: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
});

export default Input;
