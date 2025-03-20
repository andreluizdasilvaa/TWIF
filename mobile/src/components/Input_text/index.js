import { View, Text, TextInput  } from 'react-native';

import styles from './styles'

export default function Input_Text({ placeholder, keyboardType }) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );
}

