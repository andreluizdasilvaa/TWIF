import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    containerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        borderRadius: 8,
        borderColor: '#000000',
        borderWidth: 2,
        paddingHorizontal: 6,
        maxHeight: 40,
        width: '100%',
        minWidth: 250,
    },
    input: {
        height: 40,
        width: '90%',
        minWidth: 300,
        backgroundColor: 'trasparent',
        borderWidth: 0,
        padding: 12,
        outlineStyle: 'none',
    },
});

export default style;