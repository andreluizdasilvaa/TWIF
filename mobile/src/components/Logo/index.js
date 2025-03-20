import { View, Text, StyleSheet  } from 'react-native';
import { Image } from 'expo-image';


export default function Logo({width, height}) {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/imgs/logo.png')}
                style={{ width: width, height: height, resizeMode: 'contain' }}

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
})