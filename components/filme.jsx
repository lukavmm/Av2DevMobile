import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  off,
  update,
} from "firebase/database";

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

  const [showModal, setShowModal] = useState(false);
  const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [users, setUsers] = useState([]);

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

    const usersRef = ref(db, "user");

    const usersListener = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({
          userId: key,
          ...data[key],
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => {
      off(filmesRef, filmesListener);
      off(usersRef, usersListener);
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

  function updateFilm(filmId) {
    // if (!validateDate(editLancamento)) {
    //   setError("Data de lançamento inválida. Formato aceito: DD-MM-YYYY");
    //   return;
    // }
    console.log(filmId);

    const db = getDatabase();
    const filmRef = ref(db, `filme/${filmId}`);

    update(filmRef, {
      titulo: editTitle,
      duração: editDuration,
      genero: editGenre,
      lancamento: editLancamento,
    })
      .then(() => {
        console.log("Filme atualizado");
        setEditFilmId("");
        setEditTitle("");
        setEditDuration("");
        setEditGenre("");
        setEditLancamento("");
        setError("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteFilm(filmId) {
    const db = getDatabase();
    const filmRef = ref(db, `filme/${filmId}`);

    set(filmRef, null)
      .then(() => {
        console.log("Filme deletado");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleOpenModal(filmId) {
    setSelectedFilmId(filmId);
    setShowModal(true);
  }

  function handleAssociateUser(userId, userName) {
    const db = getDatabase();
    const filmRef = ref(db, `filme/${selectedFilmId}/user`);

    update(filmRef, {
      [userId]: true,
      [userName]: userName,
    })
      .then(() => {
        setShowModal(false);
        setSelectedFilmId(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Filmes</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Duração"
          value={duration}
          onChangeText={setDuration}
        />
        <TextInput
          style={styles.input}
          placeholder="Gênero"
          value={genre}
          onChangeText={setGenre}
        />
        <TextInput
          style={styles.input}
          placeholder="Lançamento (DD-MM-YYYY)"
          value={lancamento}
          onChangeText={setLancamento}
        />
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        <Button title="Cadastrar" onPress={create} />
      </View>

      <Text style={styles.title}>Lista de Filmes</Text>
      {films.map((film) => (
        <View style={styles.filmItem} key={film.filmeId}>
          <Text style={styles.filmTitle}>{film.titulo}</Text>
          <Text style={styles.filmText}>Duração: {film.duração}</Text>
          <Text style={styles.filmText}>Gênero: {film.genero}</Text>
          <Text style={styles.filmText}>Lançamento: {film.lancamento}</Text>
          <Button title="Editar" onPress={() => updateFilm(film.filmeId)} />
          <Button title="Deletar" onPress={() => deleteFilm(film.filmeId)} />
          <Button
            title="Associar Usuário"
            onPress={() => handleOpenModal(film.filmeId)}
          />
        </View>
      ))}

      {showModal && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Alugar</Text>
          {users.map((user) => (
            <View style={styles.userItem} key={user.userId}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userName}>{user.email}</Text>
              <Button
                title="Alugar"
                onPress={() => handleAssociateUser(user.userId, user.name)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  filmItem: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  filmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  filmText: {
    marginBottom: 5,
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    marginRight: 10,
    color: "#fff",
  },
  associar: {
    display: "flex",
  },
});
export default Filme;
