import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getDatabase, ref, set, push, onValue, off } from "firebase/database";

export function Filme() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [lancamento, setLancamento] = useState("");
  const [error, setError] = useState("");

  const [editFilmId, setEditFilmId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editLancamento, setEditLancamento] = useState("");
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const filmesRef = ref(db, "filme");

    const filmesListener = onValue(filmesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filmsList = Object.keys(data).map((key) => ({
          filmeId: key,
          ...data[key],
        }));
        setFilms(filmsList);
      } else {
        setFilms([]);
      }
    });

    return () => {
      off(filmesRef, filmesListener);
    };
  }, []);

  function validateDate(date) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(date);
  }

  function create() {
    if (!validateDate(lancamento)) {
      setError("Data de lançamento inválida. Formato aceito: DD-MM-YYYY");
      return;
    }

    const db = getDatabase();
    const filmesRef = ref(db, "filme");

    const novoFilmeRef = push(filmesRef);
    const novoFilmeId = novoFilmeRef.key; // Obtém o push ID gerado automaticamente

    set(novoFilmeRef, {
      filmeId: novoFilmeId,
      titulo: title,
      duração: duration,
      genero: genre,
      lancamento: lancamento,
    })
      .then(() => {
        console.log("Dados enviados");
        // Limpar os campos do formulário
        setTitle("");
        setDuration("");
        setGenre("");
        setLancamento("");
        setError(""); // Limpar a mensagem de erro
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditFilm(filmId) {
    const film = films.find((film) => film.filmeId === filmId);
    if (film) {
      setEditFilmId(filmId);
      setEditTitle(film.titulo);
      setEditDuration(film.duração);
      setEditGenre(film.genero);
      setEditLancamento(film.lancamento);
    }
  }

  async function updateFilm() {
    const db = getDatabase();
    const filmRef = ref(db, `filme/${editFilmId}`);

    await set(filmRef, {
      titulo: editTitle,
      duração: editDuration,
      genero: editGenre,
      lancamento: editLancamento,
    });

    setEditFilmId("");
    setEditTitle("");
    setEditDuration("");
    setEditGenre("");
    setEditLancamento("");
  }

  async function deleteFilm(filmId) {
    const db = getDatabase();
    const filmRef = ref(db, `filme/${filmId}`);

    await set(filmRef, null);
  }

  return (
    <View>
      <TextInput
        style={styles.form}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
      />
      <TextInput
        style={styles.form}
        value={duration}
        onChangeText={setDuration}
        placeholder="Duração"
      />
      <TextInput
        style={styles.form}
        value={genre}
        onChangeText={setGenre}
        placeholder="Gênero"
      />
      <TextInput
        style={styles.form}
        value={lancamento}
        onChangeText={setLancamento}
        placeholder="Data de lançamento (YYYY-MM-DD)"
      />
      <Button title="Cadastrar Filme" onPress={create} />

      <Text style={styles.title}>Filmes Cadastrados:</Text>
      {films.map((film) => (
        <View key={film.filmeId} style={styles.filmContainer}>
          <Text style={styles.filmInfo}>Título: {film.titulo}</Text>
          <Text style={styles.filmInfo}>Duração: {film.duração}</Text>
          <Text style={styles.filmInfo}>Gênero: {film.genero}</Text>
          <Text style={styles.filmInfo}>Lançamento: {film.lancamento}</Text>
          <View style={styles.filmButtonContainer}>
            <Button
              style={styles.filmButton}
              title="Editar"
              onPress={() => handleEditFilm(film.filmeId)}
            />
            <Button
              style={styles.filmButton}
              title="Deletar"
              onPress={() => deleteFilm(film.filmeId)}
            />
          </View>
        </View>
      ))}

      {editFilmId && (
        <View>
          <Text style={styles.title}>Editar Filme:</Text>
          <TextInput
            style={styles.form}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Título"
          />
          <TextInput
            style={styles.form}
            value={editDuration}
            onChangeText={setEditDuration}
            placeholder="Duração"
          />
          <TextInput
            style={styles.form}
            value={editGenre}
            onChangeText={setEditGenre}
            placeholder="Gênero"
          />
          <TextInput
            style={styles.form}
            value={editLancamento}
            onChangeText={setEditLancamento}
            placeholder="Data de lançamento (DD-MM-YYYY)"
          />
          <Button title="Atualizar" onPress={updateFilm} />
        </View>
      )}

      {/* Renderizar a mensagem de erro, se houver */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    fontSize: 20,
    margin: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: "Roboto",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  filmContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  filmInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  filmButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  filmButton: {
    marginLeft: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Filme;
