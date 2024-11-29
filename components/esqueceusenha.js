import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; 

export default function ForgotPassPage({ navigation }) {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Email Enviado",
        "Verifique sua caixa de entrada para redefinir sua senha.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) { 
      console.error("Erro ao enviar o email de redefinição:", error.code);

      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado. Verifique o email.";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido. Verifique o formato.";
          break;
        default:
          errorMessage = "Ocorreu um erro. Tente novamente.";
      }

      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
    <ImageBackground resizeMode="cover" style={styles.fundo} source={require("../assets/fundoLogin2.png")}>
      
       <View style={styles.AlignItens}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Insira seu email"
          placeholderTextColor="rgba(0,0,0,0.5)"
        />
        <TouchableOpacity style={styles.btnEnviar} onPress={handlePasswordReset}>
          <Text style={styles.txtBtn}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.voltar}>Voltar ao Login</Text>
        </TouchableOpacity>
        </View>
        </ImageBackground>

        
      </View>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  fundo: {

    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
},

AlignItens: {
    top:'15%' ,
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
},
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    marginBottom: 35,
    textAlign: 'center',
    color: 'white',
    borderColor: "rgba(0,0,0,0.5)",
    fontWeight:800
  },
  input: {
    bottom: 20,
        width: 300,
        height: 50,
        textAlign: 'center',
        backgroundColor: 'white',
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 25,
        marginBottom: 350,
        
  },
  btnEnviar: {
    width: 150,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'grey',
    top: 5,
  },
  txtBtn: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    padding: 7,
  },
  voltar: {
    color: "Black",
    fontSize: 18,
    marginTop: 20,
  },
});