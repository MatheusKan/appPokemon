import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, ScrollView } from 'react-native';
import { firestore } from '../firebase';
import { doc, updateDoc } from "firebase/firestore";

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
    imageUri = ''  // Foto existente do Pokémon, mas não será alterada
  } = route.params || {}; // Valores padrões

  // Inicializando os estados dos campos do Pokémon
  const [nomePokemonState, setNomePokemon] = useState(nomePokemon);
  const [tipoState, setTipo] = useState(tipo);
  const [alturaState, setAltura] = useState(altura);
  const [pesoState, setPeso] = useState(peso);
  const [numeroState, setNumero] = useState(numero);

  // Função para atualizar os dados do Pokémon
  async function changePokemon() {
    if (!nomePokemonState || !tipoState || !alturaState || !pesoState || !numeroState) {
      Alert.alert("Erro", "Por favor, preencha todos os campos antes de alterar.");
      return;
    }
    Alert.alert("Sucesso", "Pokémon alterado com sucesso.");
    navigation.navigate("Home");
    try {
      // Atualiza o documento do Pokémon na coleção "tblPokemon"
      await updateDoc(doc(firestore, "tblPokemon", id), {
        nomePokemon: nomePokemonState,
        tipo: tipoState,
        altura: alturaState,
        peso: pesoState,
        numero: numeroState,
        imageUri: imageUri  // Mantém a imagem existente, sem alteração
      });

 // Volta para a tela principal
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

            {/* Não exibe nem permite atualizar a imagem */}
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}

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
    marginTop: 100,
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
    marginTop: 5,
  },
});
