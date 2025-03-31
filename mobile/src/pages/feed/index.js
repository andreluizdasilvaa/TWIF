import { StatusBar } from 'expo-status-bar'
import { Image } from 'expo-image';
import { Text, View, Pressable } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';

import styles from './styles'
import Logo from '../../components/Logo';

export default function Feed({ navigation }) {


    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Entypo name="menu" size={30} color="black" onPress={() => navigation.navigate("Login")}/>
                <Logo width={100} height={60}/>
                <Image 
                    source={{ uri: "https://th.bing.com/th/id/OIP.qp_LN0rfFLziKT4SOs4tDAHaHa?rs=1&pid=ImgDetMain" }}
                    style={styles.imageUser}
                />
            </View>



            <StatusBar style="auto" />
        </View>
    )
}