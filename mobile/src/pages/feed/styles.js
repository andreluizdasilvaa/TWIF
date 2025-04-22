import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    imageUser: {
        width: 40,
        height: 40,
        borderRadius: '100%',
        borderBlockColor: '#000000',
        borderWidth: 1,
    },
});

export default styles;
