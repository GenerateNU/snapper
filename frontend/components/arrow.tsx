import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface ArrowProps {
    onPress: () => void;
    backgroundColor?: string;
    color?: string;
}

const Arrow: React.FC<ArrowProps> = ({ onPress, backgroundColor = 'white', color = 'black' }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <FontAwesomeIcon icon={faChevronRight} size={16} color={color} />
        </TouchableOpacity>
    );
};

export default Arrow;