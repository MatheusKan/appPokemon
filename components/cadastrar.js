import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,ImageBackground } from "react-native";
import { auth } from "../firebase"; // Certifique-se de importar corretamente
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // Importar as funções necessárias

export default function Signin({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const cadastrarUsuario = () => {
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        createUserWithEmailAndPassword(auth, email, senha)
            .then(userCredential => {
                const user = userCredential.user;

                // Enviar e-mail de verificação
                sendEmailVerification(user)
                    .then(() => {
                        Alert.alert("Sucesso", "Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar o cadastro.");
                        navigation.navigate("Login");
                    })
                    .catch(error => {
                        Alert.alert("Erro", `Erro ao enviar e-mail de verificação: ${error.message}`);
                    });
            })
            .catch(error => {
                Alert.alert("Erro", `Erro ao cadastrar: ${error.message}`);
            });
    };

    return (
        <View style={estilo.container}>
             <ImageBackground resizeMode="cover" style={estilo.fundo} source={require("../assets/fundo 2.png")}>
             <View style={estilo.AlignItens}>
            <Text style={estilo.titulo}>Cadastro</Text>
            <TextInput
                style={estilo.inputTexto}
                onChangeText={text => setEmail(text)}
                placeholder="Digite seu email"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={estilo.inputTexto}
                secureTextEntry
                onChangeText={text => setSenha(text)}
                placeholder="Digite sua senha"
            />
            <TextInput
                style={estilo.inputTexto}
                secureTextEntry
                onChangeText={text => setConfirmarSenha(text)}
                placeholder="Confirme sua senha"
            />
            <TouchableOpacity style={estilo.botaoCadastrar} onPress={cadastrarUsuario}>
                <Text style={estilo.textoBotaoCadastrar}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilo.botaoVoltar} onPress={() => navigation.navigate("Login")}>
                <Text style={estilo.textoBotaoVoltar}>Voltar ao Login</Text>
            </TouchableOpacity>
            </View>
            </ImageBackground>
        </View>
    );
}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    AlignItens: {
        top:'18%' ,
        position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fundo: {

        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
    },
    titulo: {
        fontSize: 40,
        marginBottom: 20,
        color: 'white',
    },
    inputTexto: {
        width: 300,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 18,

    },
    botaoCadastrar: {
        backgroundColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 230,
    },
    textoBotaoCadastrar: {
        fontSize: 20,
        color: 'white',
    },
    botaoVoltar: {
        marginTop: 15,
       
    },
    textoBotaoVoltar: {
        fontSize: 21,
        fontWeight: "bold",
        
    },
});