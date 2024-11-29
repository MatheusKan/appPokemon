import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Para escolher uma imagem
import { firestore } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Função para fazer upload da imagem para o Firebase Storage
const uploadImage = async (uri) => {
  const storage = getStorage();
  const fileExtension = uri.split('.').pop(); // Extensão do arquivo
  const fileName = `pokemon_${new Date().getTime()}.${fileExtension}`;
  const storageRef = ref(storage, 'pokemons/' + fileName);

  const imgResponse = await fetch(uri); // Pega a imagem
  const blob = await imgResponse.blob(); // Converte a imagem em blob

  await uploadBytes(storageRef, blob); // Faz o upload da imagem

  const downloadURL = await getDownloadURL(storageRef); // Obtém a URL da imagem
  return downloadURL;
};

export default function ChangePokemon({ navigation, route }) {
  useEffect(() => {
    console.log('Parametros recebidos:', route.params);
  }, [route.params]);

  const { 
    id, 
    nomePokemon = '', 
    tipo = '', 
    altura = '', 
    peso = '', 
    numero = '',
    imageUri = ''  // Foto existente do Pokémon
  } = route.params || {}; // Valores padrões

  // Inicializando os estados dos campos do Pokémon
  const [nomePokemonState, setNomePokemon] = useState(nomePokemon);
  const [tipoState, setTipo] = useState(tipo);
  const [alturaState, setAltura] = useState(altura);
  const [pesoState, setPeso] = useState(peso);
  const [numeroState, setNumero] = useState(numero);
  const [image, setImage] = useState(imageUri); // Estado para a imagem
  const [permissionStatus, setPermissionStatus] = useState(null); // Estado para armazenar o status das permissões

  // Função para verificar e solicitar permissões para acessar a galeria de imagens
  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPermissionStatus(status); // Atualiza o estado com o status da permissão
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return false;
    }
    return true;
  };

  // Função para selecionar a imagem
  const pickImage = async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      return; // Se não tiver permissão, retorna sem fazer nada
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Faz o upload da imagem e obtém a URL
      const uploadUrl = await uploadImage(result.uri);
      setImage(uploadUrl);  // Atualiza o estado com a URL da nova imagem
    }
  };

  // Função para atualizar os dados do Pokémon
  async function changePokemon() {
    if (!nomePokemonState || !tipoState || !alturaState || !pesoState || !numeroState) {
      Alert.alert("Erro", "Por favor, preencha todos os campos antes de alterar.");
      return;
    }

    try {
      // Se uma nova imagem foi selecionada, faz o upload e obtém a URL
      const imageUrl = image ? image : null; // Se não tiver imagem, envia null

      // Atualiza o documento do Pokémon na coleção "tblPokemon"
      await updateDoc(doc(firestore, "tblPokemon", id), {
        nomePokemon: nomePokemonState,
        tipo: tipoState,
        altura: alturaState,
        peso: pesoState,
        numero: numeroState,
        imageUri: imageUrl  // Atualiza a URL da imagem
      });

      Alert.alert("Sucesso", "Pokémon alterado com sucesso.");
      navigation.navigate("Home"); // Volta para a tela principal
    } catch (error) {
      console.error("Erro ao alterar: ", error);
      Alert.alert("Erro", "Erro ao alterar. Por favor, tente novamente.");
    }
  }

  return (
    <ImageBackground style={styles.fundo2} resizeMode="cover" source={require('../assets/fundoMudar.jpg')}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titulo}>Alterar dados do Pokémon</Text>
          <View style={styles.inputView}>
            <Text style={styles.texto}>Número do Pokémon</Text>
            <TextInput
              style={styles.input}
              value={numeroState}
              placeholder="Número do Pokémon"
              onChangeText={setNumero}
              keyboardType="numeric"
            />
            <Text style={styles.texto}>Nome do Pokémon</Text>
            <TextInput
              style={styles.input}
              value={nomePokemonState}
              placeholder="Nome do Pokémon"
              onChangeText={setNomePokemon}
            />
            <Text style={styles.texto}>Tipo do Pokémon</Text>
            <TextInput
              style={styles.input}
              value={tipoState}
              placeholder="Tipo"
              onChangeText={setTipo}
            />
            <Text style={styles.texto}>Altura do Pokémon</Text>
            <TextInput
              style={styles.input}
              value={alturaState}
              placeholder="Altura (m)"
              onChangeText={setAltura}
              keyboardType="numeric"
            />
            <Text style={styles.texto}>Peso do Pokémon</Text>
            <TextInput
              style={styles.input}
              value={pesoState}
              placeholder="Peso (kg)"
              onChangeText={setPeso}
              keyboardType="numeric"
            />
            
            {image && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
            <TouchableOpacity style={styles.btnenviar} onPress={pickImage}>
              <Text style={styles.btntxtenviar}>Escolher Imagem</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnenviar} onPress={changePokemon}>
              <Text style={styles.btntxtenviar}>Alterar</Text>
            </TouchableOpacity>
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
  fundo2: {
    flex: 1,
  },
  texto:{
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
    width: 110,
  },
  btntxtenviar: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  titulo: {
    color: 'white',
    marginVertical: 40,
    fontSize: 25,
    textAlign: 'center',
  },
  btnVoltar: {
    backgroundColor: '#FF5050',
    marginTop: 5
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
});
