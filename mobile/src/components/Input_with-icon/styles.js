import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 8,
        borderColor: '#000000',
        borderWidth: 2,
        paddingHorizontal: 6,
        maxHeight: 40,
        width: '100%',
        minWidth: 250,
        maxWidth: 300,
    },
    input: {
        height: 40,
        width: '100%',
        minWidth: 300,
        backgroundColor: 'trasparent',
        borderWidth: 0,
        padding: 12,
        outlineStyle: 'none',
    },
});

export default style;