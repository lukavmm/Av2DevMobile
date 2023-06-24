import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Usuario from "./components/usuario";
import Filme from "./components/filme";
import Locadora from "./components/locadora";
import MostrarFilmes from "./components/mostrarFilmes";

export default function App() {
  const [addUser, setAddUser] = useState(false);
  const [addMovie, setAddMovie] = useState(false);
  const [addLocadora, setAddLocadora] = useState(false);
  const [showFilmes, setShowFilmes] = useState(false);

  function handleAddUser() {
    setAddMovie(false);
    setAddLocadora(false);
    setShowFilmes(false);
    setAddUser(!addUser);
  }

  function handleAddMovie() {
    setAddUser(false);
    setAddLocadora(false);
    setShowFilmes(false);
    setAddMovie(!addMovie);
  }

  function handleAddLocadora() {
    setAddUser(false);
    setAddMovie(false);
    setShowFilmes(false);
    setAddLocadora(!addLocadora);
  }

  function handleShowFilmes() {
    setAddUser(false);
    setAddMovie(false);
    setAddLocadora(false);
    setShowFilmes(!showFilmes);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Desenvolvimento Mobile</Text>

      <View style={styles.content}>
        {addUser && <Usuario />}
        {addMovie && <Filme />}
        {addLocadora && <Locadora />}
        {showFilmes && <MostrarFilmes />}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          onPress={handleAddUser}
          title="Cadastrar usuário"
        />
        <Button
          style={styles.button}
          onPress={handleAddMovie}
          title="Cadastrar filme"
        />
        <Button
          style={styles.button}
          onPress={handleAddLocadora}
          title="Cadastrar locadora"
        />
        <Button
          style={styles.button}
          onPress={handleShowFilmes}
          title="Visualizar filmes disponíveis"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    width: "80%",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    flex: "wrap",
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    padding: 14,
    borderRadius: 7,
    backgroundColor: "#054f77",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
});
