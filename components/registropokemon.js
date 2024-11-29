import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image, ScrollView } from "react-native";
import { firestore, auth } from '../firebase'; 
import { collection, addDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker'; // Importando o ImagePicker

export default function RegisterPokemon({ navigation }) {
  const [nomePokemon, setNomePokemon] = useState("");
  const [tipo, setTipo] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [numero, setNumero] = useState("");
  const [imageUri, setImageUri] = useState(null); // Estado para armazenar o URI da imagem

  // Função para pedir permissão e selecionar a imagem
  const pickImage = async () => {
    // Verifica a permissão de acesso à galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria de fotos.");
      return;
    }

    // Abre o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Aspect ratio da imagem (opcional)
      quality: 1, // Qualidade da imagem
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Atualiza o URI da imagem
    }
  };


const handleAddPokemon = async () => {
  if (!nomePokemon || !tipo || !altura || !peso || !numero) {
    Alert.alert("Erro", "Por favor, preencha todos os campos.");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para cadastrar um Pokémon.");
      return;
    }

    // Adicionando o Pokémon à coleção 'tblPokemon' com o usuário autenticado
    await addDoc(collection(firestore, 'tblPokemon'), {
      nomePokemon,
      tipo,
      altura,
      peso,
      numero,
      userId: user.uid, // Armazenando o ID do usuário
      imageUri, // Salvando a imagem do Pokémon
    });

    Alert.alert("Sucesso", "Pokémon cadastrado com sucesso!");
    navigation.navigate("Home");  // Altere aqui para navegação direta para a tela "Home"
  } catch (error) {
    Alert.alert("Erro", "Ocorreu um erro ao cadastrar o Pokémon. Tente novamente.");
    console.error("Erro ao cadastrar Pokémon: ", error);
  }
  navigation.navigate("Home");
};


  return (
    <ImageBackground style={styles.fundo} resizeMode="cover" source={require('../assets/fundo.jpg')}>
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titulo}>Cadastrar Pokémon</Text>
        
        {/* Input para o número do Pokémon */}
        <View style={styles.inputView}>
          <Text style={styles.texto}>Número do Pokémon</Text>
          <TextInput
            style={styles.input}
            placeholder="Número do Pokémon"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
          />

          {/* Outros inputs */}
          <Text style={styles.texto}>Nome do Pokémon</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Pokémon"
            value={nomePokemon}
            onChangeText={setNomePokemon}
          />
          <Text style={styles.texto}>Tipo do Pokémon</Text>
          <TextInput
            style={styles.input}
            placeholder="Tipo do Pokémon"
            value={tipo}
            onChangeText={setTipo}
          />
          <Text style={styles.texto}>Altura do Pokémon</Text>
          <TextInput
            style={styles.input}
            placeholder="Altura do Pokémon (m)"
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
          />
          <Text style={styles.texto}>Peso do Pokémon</Text>
          <TextInput
            style={styles.input}
            placeholder="Peso do Pokémon (kg)"
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
          />

          {/* Botão para selecionar a imagem */}
          <TouchableOpacity style={styles.btnenviar} onPress={pickImage}>
            <Text style={styles.btntxtenviar}>Selecionar Imagem</Text>
          </TouchableOpacity>

          {/* Exibe a imagem selecionada */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}

          {/* Botão para cadastrar o Pokémon */}
          <TouchableOpacity style={styles.btnenviar} onPress={handleAddPokemon}>
            <Text style={styles.btntxtenviar}>Cadastrar</Text>
          </TouchableOpacity>

          {/* Botão de voltar */}
          <TouchableOpacity
            style={[styles.btnenviar, styles.btnVoltar]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.btntxtenviar}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fundo: {
    flex: 1,
  },
  titulo: {
    color: 'white',
    marginVertical: 40,
    fontSize: 25,
    textAlign: 'center',
  },
  texto: {
    color: 'white',
    fontSize: 21,
  },
  input: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    fontWeight: '700',
    padding: 8,
    width: 260,
    fontSize: 18,
    borderRadius: 10,
  },
  inputView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnenviar: {
    marginTop: 38,
    backgroundColor: '#686868',
    borderColor: '#ffffff',
    borderWidth: 0.6,
    borderRadius: 10,
    padding: 10,
    width: 120,
  },
  btntxtenviar: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  btnVoltar: {
    backgroundColor: '#FF5050',
    marginTop: 5,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 20,
  }
});
