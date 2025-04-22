import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#7EC543',
        borderRadius: '50%',
        boxShadow: '2px 2px 0px #000000',
        position: 'fixed',
        bottom: 50,
        right: 50,
        zIndex: 1000,
    },
})

export default styles;