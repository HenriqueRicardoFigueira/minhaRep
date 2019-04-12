import { StyleSheet } from 'react-native';

// para alterar a cor da borda dinamicamente
var input = (borderColor) => {
    return {
        paddingTop: 10,
        height: 45,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        borderColor: borderColor,
        borderWidth: 1,
        paddingHorizontal: 20,
        marginBottom: 30,
        borderRadius: 50,
        fontSize: 18
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7ff',
        padding: 10,
    },

    button: {
        height: 45,
        backgroundColor: '#069',
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },

    butonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18
    },

    image: {
        width: 180,
        height: 180,
        justifyContent: 'center'
    },

    loginView: {
        paddingTop: 10
    }
});

module.exports = {input, styles};