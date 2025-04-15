import { View, Text  } from "react-native";
import Feather from '@expo/vector-icons/Feather';

import styles from './styles'

export default function ModalInputPost() {
    return(
        <View style={styles.container}>
            <Feather name="edit" size={24} color="black" />
        </View>
    )
}