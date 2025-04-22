import { View, Text, Button } from "react-native";
import { Image } from "expo-image";

import styles from "./styles";

export default function Post({ picture, nameUser, description, quantLike, quantComment }) {
    return(
        <View>
            <View>
                <Image 
                    source={{ uri: picture}}
                />

                <Text>{nameUser}</Text>
            </View>
            
            <View>
                <Text>{description}</Text>
            </View>

            <View>
                <Button title={`Curtidas: ${quantLike}`} />
                <Button title={`Comentários: ${quantComment}`} />
            </View>
        </View>
    )
}