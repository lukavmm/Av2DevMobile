import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "./config";

export function MostrarFilmes() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const filmesRef = ref(db, "filme");

    onValue(filmesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filmesList = Object.entries(data).map(([filmeId, filme]) => ({
          filmeId,
          ...filme,
        }));
        setFilmes(filmesList);
      }
    });
  }, []);

  return (
    <View>
      {filmes.length > 0 ? (
        filmes.map((filme) => (
          <View key={filme.filmeId}>
            <Text>Título: {filme.titulo}</Text>
            <Text>Duração: {filme.duracao}</Text>
            <Text>Gênero: {filme.genero}</Text>
            <Text>Lançamento: {filme.lancamento}</Text>
            <Text>-----------------------</Text>
          </View>
        ))
      ) : (
        <Text>Nenhum filme cadastrado</Text>
      )}
    </View>
  );
}

export default MostrarFilmes;
