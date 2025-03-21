import { View, Text, TextInput, TouchableOpacity  } from 'react-native';

import styles from './styles'

export default function StandardButton({ children }) {
   return(
    <TouchableOpacity style={styles.button}>
        <Text style={styles.textBtn}>{children}</Text>
    </TouchableOpacity>
   )
}

