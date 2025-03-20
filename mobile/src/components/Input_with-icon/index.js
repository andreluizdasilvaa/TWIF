import { View, Text, TextInput  } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from './styles'

export default function Input_Text_Icon({ iconName, placeholder, keyboardType, maxLength }) {
    return (
        <View style={styles.container}>
            <View style={styles.containerBtn}>
                <Ionicons name={iconName} size={24} color="#000000" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
            </View>
            
        </View>
    );
}

