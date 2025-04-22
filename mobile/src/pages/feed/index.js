
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Text, View, Pressable, ScrollView } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

import styles from './styles';
import Logo from '../../components/Logo';
import ModalInputPost from '../../components/modalInputPost';
import Post from '../../components/post';


export default function Feed({ navigation }) {
    const [posts, setPosts] = useState([]);

    // Api para teste
    useEffect(() => {
        try {
            fetch('http://localhost:3000/feed/posts')
                .then(r => r.json())
                .then(resp => {
                    console.log(resp);
                    setPosts(resp);
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <View style={styles.container}>
            <ModalInputPost />
            <View style={styles.header}>
                <Entypo
                    name="menu"
                    size={30}
                    color="black"
                    onPress={() => navigation.navigate('Login')}
                />
                <Logo width={100} height={60} />
                <Image
                    source={{
                        uri: 'https://th.bing.com/th/id/OIP.qp_LN0rfFLziKT4SOs4tDAHaHa?rs=1&pid=ImgDetMain',
                    }}
                    style={styles.imageUser}
                />
            </View>

            <ScrollView>
                {posts.map(post => (
                    <Post
                        key={post.id}
                        picture={post.user.profilePicture}
                        nameUser={post.user.nome}
                        description={post.content}
                        quantLike={post.likes.length}
                        quantComment={post.comments.length}
                    />
                ))}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}
