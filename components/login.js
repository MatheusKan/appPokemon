import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ImageBackground } from "react-native";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth"; 

export default function Login({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Função de validação de e-mail
    function validarEmail(email) {
        // Expressão regular para validar o formato de e-mail
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    useEffect(() => {
        if (route?.params?.clearFields) {
            setEmail('');
            setSenha('');
        }
    }, [route?.params]);

    function logar() {
        if (!validarEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido.");
            return;
        }

        signInWithEmailAndPassword(auth, email, senha)
            .then(userCredential => {
                const user = userCredential.user;

                console.log("Usuário autenticado e verificado:", email);
                navigation.navigate('Rotas', { email });
            })
            .catch(error => {
                let errorMessage = "Erro desconhecido. Tente novamente.";
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = "Usuário não encontrado. Verifique se o e-mail está correto.";
                        break;
                    case 'auth/wrong-password':
                        errorMessage = "Senha incorreta. Tente novamente.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "E-mail inválido. Verifique o formato.";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Falha na conexão. Verifique sua internet.";
                        break;
                    default:
                        errorMessage = error.message;
                        break;
                }
                Alert.alert("Erro", errorMessage);
                console.error("Erro de login:", error.message);
            });
    }

    return (
        <View style={estilo.container}>
            <ImageBackground resizeMode="cover" style={estilo.fundo} source={require("../assets/fundoLogin.png")}>
                <View style={estilo.AlignItens}>
                    <Text style={estilo.titulo}>Login</Text>
                    <TextInput
                        style={estilo.inputTexto}
                        onChangeText={text => setEmail(text)}
                        placeholder="Digite o email."
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                    />
                    <TextInput
                        style={estilo.inputTexto}
                        secureTextEntry={true}
                        onChangeText={text => setSenha(text)}
                        placeholder="Digite a senha."
                        value={senha}
                    />
                    <TouchableOpacity style={estilo.botaoLogar} onPress={logar}>
                        <Text style={estilo.textoBotaoLogar}>Logar</Text>
                    </TouchableOpacity>

                    <View style={estilo.signView1}>
                        <Text style={estilo.txtSign}>Primeiro acesso</Text>
                        <TouchableOpacity style={estilo.btnSign} onPress={() => navigation.navigate('Entrar')}>
                            <Text style={estilo.txtBtnSign}> Clique aqui</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={estilo.signView2}>
                        <Text style={estilo.txtSign}>Esqueceu a senha?</Text>
                        <TouchableOpacity style={estilo.btnSign} onPress={() => navigation.navigate('Esqueceu')}>
                            <Text style={estilo.txtBtnSign}> Clique aqui</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ImageBackground>
        </View>
    );
}


const estilo = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fundo: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
    },

    AlignItens: {
        top: '9%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 50,
        marginBottom: 35,
        textAlign: 'center',
        color: 'white',
    },
    inputTexto: {
        bottom: 20,
        width: 300,
        height: 50,
        textAlign: 'center',
        backgroundColor: 'white', 
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 25,
        borderWidth: 1,               
        borderColor: 'white',         
    },
    botaoLogar: {
        width: 150,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'grey',
        top: 5,
        marginTop: 250,
    },
    textoBotaoLogar: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        padding: 7,
    },
    signView1: {
        marginVertical: 15,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },

    signView2: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: -10,
    },
    txtSign: {
        color: 'black',
        fontSize: 24,
        justifyContent: 'center',
    },
    btnSign: {
        justifyContent: 'center',
    },
    txtBtnSign: {
        color: 'white',
        fontSize: 21,
        justifyContent: 'center',
    },
});
