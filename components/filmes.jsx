import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { db } from "./config";

export function Filmes() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const filmesRef = ref(database, "filme");

    onValue(filmesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filmesList = Object.entries(data).map(([id, filme]) => ({
          id,
          ...filme,
        }));
        setFilmes(filmesList);
      }
    });

    return () => {
      // Limpar o listener ao desmontar o componente
      onValue(filmesRef);
    };
  }, []);

  const handleExcluirFilme = (id) => {
    const filmeRef = ref(db, `filme/${id}`);
    remove(filmeRef)
      .then(() => {
        console.log("Filme excluído com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao excluir filme:", error);
      });
  };

  return (
    <View style={styles.container}>
      {filmes.length > 0 ? (
        <FlatList
          data={filmes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleExcluirFilme(item.id)}>
              <View style={styles.itemContainer}>
                <Text style={styles.item}>{item.titulo}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum filme cadastrado</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});

export default Filmes;
