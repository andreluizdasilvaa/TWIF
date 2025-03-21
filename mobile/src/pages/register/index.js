import { View, Text, StyleSheet } from 'react-native';

import Logo from '../../components/Logo';
import InputTextIcon from '../../components/Input_with-icon';

export default function Register({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.containerForm}>
                <Logo width={200} height={100} />

                <Text>Crie sua conta</Text>

                <View style={styles.containerInputForm}>
                    <InputTextIcon iconName={"happy-outline"} placeholder={"Digite seu nome"} keyboardType={"default"} maxLength={50}/>
                </View>
            </View>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerForm: {
        width: '90%',
    },
    containerInputForm: {
        flexDirection: 'column',
    }
})