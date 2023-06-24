import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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

        Promise.all(
          filmesList.map((filme) => {
            return new Promise((resolve) => {
              const usuariosRef = ref(db, `filme/${filme.filmeId}/user`);
              onValue(usuariosRef, (snapshot) => {
                const usuarios = snapshot.val() || {};
                resolve({
                  filmeId: filme.filmeId,
                  ...filme,
                  usuarios: Object.keys(usuarios),
                });
              });
            });
          })
        ).then((result) => {
          setFilmes(result);
        });
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
            {filme.usuarios.length > 0 && (
              <>
                <Text>Usuários associados:</Text>
                <View style={styles.usuario}>
                  {filme.usuarios.map((usuarioId) => (
                    <Text key={usuarioId}>{usuarioId}</Text>
                  ))}
                </View>
              </>
            )}
            <Text>-----------------------</Text>
          </View>
        ))
      ) : (
        <Text>Nenhum filme cadastrado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  usuario: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: 20,
    margin: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: "Roboto",
    padding: 10,
  },
});

export default MostrarFilmes;
