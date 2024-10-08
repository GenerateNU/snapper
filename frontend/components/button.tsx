import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
    text?: string;              
    onPress?: () => void;    
    backgroundColor?: string;
    color?: string;  
    disabled?: boolean;
    type?: "text" | "full";      
}

const Button: React.FC<ButtonProps> = ({ text, onPress, backgroundColor = '#007BFF', color = '#FFFFFF', disabled, type = "full" }) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    );
};

export default Button;
