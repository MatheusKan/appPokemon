import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ImageBackground, Image, } from "react-native";
import { firestore, auth } from "../firebase";
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// Componente para cada item de Pokémon na lista
const PokemonItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.pokemonItem}>
    <TouchableOpacity onPress={() => onEdit(item)}>
      <View style={styles.pokemonDetails}>
        <Text style={styles.pokemonTitle}>Pokémon Capturado</Text>
        <Text style={styles.pokemonText}>Número: {item.numero}</Text>
        <Text style={styles.pokemonText}>Nome: {item.nomePokemon}</Text>
        <Text style={styles.pokemonText}>Tipo: {item.tipo}</Text>
        <Text style={styles.pokemonText}>Altura: {item.altura}m</Text>
        <Text style={styles.pokemonText}>Peso: {item.peso}kg</Text>

        {/* Exibindo a imagem do Pokémon */}
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.pokemonImage} />
        )}
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
      <Text style={styles.deleteText}>X</Text>
    </TouchableOpacity>
  </View>
);

export default function Home({ navigation }) {
  const [pokemons, setPokemons] = useState([]);

  // Deleta um Pokémon do Firestore
  const deletePokemon = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'tblPokemon', id));
      Alert.alert("Pokémon deletado.");
    } catch (error) {
      console.error("Erro ao deletar Pokémon:", error);
      Alert.alert("Erro", "Não foi possível excluir o Pokémon.");
    }
  };

  // Confirmação de exclusão de Pokémon
  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este Pokémon?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => deletePokemon(id) },
      ]
    );
  };

  // Função de logout
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login"); // Navega para a tela de login
      })
      .catch((error) => {
        Alert.alert("Erro", "Não foi possível fazer logout.");
        console.error("Erro ao fazer logout:", error);
      });
  };

  // Obtém os Pokémons do Firestore para o usuário logado
  useEffect(() => {
    const user = auth.currentUser; // Obtém o usuário autenticado
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const q = query(collection(firestore, 'tblPokemon'), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ ...doc.data(), id: doc.id });
      });
      setPokemons(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ImageBackground style={styles.background} source={require('../assets/fundoRegistro.jpg')}>
      <View style={styles.container}>
        {/* Botão de Sair - topo esquerdo */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sair</Text>
        </TouchableOpacity>

        {/* Título de Lista de Pokémons */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Lista de Pokémons</Text>
        </View>

        {/* Lista de Pokémons */}
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PokemonItem 
              item={item} 
              onEdit={(item) => navigation.navigate("Atualizar", {
                id: item.id,
                numero: item.numero,
                nomePokemon: item.nomePokemon,
                tipo: item.tipo,
                altura: item.altura,
                peso: item.peso,
              })} 
              onDelete={confirmDelete}
            />
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  
    alignItems: 'center',
    marginTop: 60,  
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  signOutButton: {
    backgroundColor: "#FF5050",
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    left: 20,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  titleBlock: {
    marginTop: 30,  
    marginBottom: 20,  
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: "black",
    fontWeight: '900',
    margin: 18,
    textDecorationLine: 'underline',
  },
  pokemonItem: {
    textAlign: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    position: 'relative',
  },
  pokemonDetails: {
    width: '80%',
    textAlign: 'center',
  },
  pokemonTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',

  },
  pokemonText: {
    fontSize: 21,
    fontWeight: '400',
    textAlign: 'center',
    marginLeft: 33,

  },
  pokemonImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 66,


  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5050',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5,
  },
  deleteText: {
    fontSize: 18,
    color: "white",
    fontWeight: '800',
  },
  addButton: {
    position: 'absolute',
    bottom: 30, 
    left: '81%',
    backgroundColor: '#787878',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
  },
  addButtonText: {
    fontSize: 40,
    color: "white",
    fontWeight: '600',
  },
});
