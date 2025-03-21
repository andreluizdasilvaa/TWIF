import { View, Text, StyleSheet, Pressable } from 'react-native';

import Logo from '../../components/Logo';
import InputTextIcon from '../../components/Input_with-icon';
import InputDatePicker from '../../components/inputDate';
import StandardButton from '../../components/buttonSubmit';

export default function Register({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.containerForm}>
                <Logo width={200} height={100} />

                <Text>Crie sua conta</Text>

                <View style={styles.containerInputForm}>
                    <InputTextIcon iconName={"happy-outline"} placeholder={"Digite seu nome"} keyboardType={"default"} maxLength={50}/>
                    <InputTextIcon iconName={"mail-open-outline"} placeholder={"meninodasilva@ALUNO.IFSP.EDU.BR"} keyboardType={"email-address"} maxLength={50}/>
                    <InputTextIcon iconName={"at-outline"} placeholder={"@meninodasilva"} keyboardType={"default"} maxLength={50}/>
                    <InputDatePicker iconName={"balloon-outline"} placeholder={"xx/xx/xxxx"} />
                    <InputTextIcon iconName={"star-outline"} placeholder={"Seu curso, ex: engenharia civil"} keyboardType={"default"} maxLength={50}/>
                    <InputTextIcon iconName={"lock-closed-outline"} placeholder={"********"} keyboardType={"visible-password"} maxLength={50} minLength={8}/>
                    <View>
                        <StandardButton>CADASTRAR</StandardButton>
                        <Text style={styles.textBottomBtnSubmit}>Já faz parte da turma? 
                            <Pressable onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.linkHook}>Faça seu Login.</Text>
                            </Pressable>
                        </Text>
                    </View>
                    
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
        gap: 24
    },
    containerInputForm: {
        flexDirection: 'column',
        gap: 12
    },
    textBottomBtnSubmit: {
        textAlign: 'center',
        color: '#025648',
    },
    linkHook: {
        textDecorationLine: 'underline'
    }
})