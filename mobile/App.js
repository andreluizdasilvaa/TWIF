import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import Input_Text from './src/components/Input_text';
import Input_Text_Icon from './src/components/Input_with-icon';
import Logo from './src/components/Logo';

export default function App() {
  return (
    <View style={styles.container}> 
      <Image 
        style={styles.topLeft}
        source={require('./src/assets/imgs/image_canto.png')}
      />

      <View style={styles.containerForm}>
        <Logo width={200} height={100}/>
        <View style={styles.containerInputForm}>
          <Text>Seu e-mail:</Text>
          <Input_Text placeholder="MENINODASILVA@ALUNO.IFSP.EDU.BR" keyboardType="email-address" />
        </View>
        
        <View style={styles.containerInputForm}>
          <Text>Sua senha:</Text>
          <Input_Text placeholder="********" keyboardType="visible-password" />
        </View>
      </View>

      <Image 
        style={styles.bottomRight}
        source={require('./src/assets/imgs/image_canto.png')}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  containerForm: {
    width: '80%',
    flexDirection: 'column',
    gap: 12,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: '-50%' },
      { translateY: '-50%' }
    ],
    alignItems: 'center',
  },
  topLeft: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomRight: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ rotate:
      '180deg'
    }]
  },
  containerInputForm: {

  }
})