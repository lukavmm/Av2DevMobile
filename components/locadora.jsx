import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  push,
} from "firebase/database";
import { db } from "./config";

export function Locadora() {
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [site, setSite] = useState("");
  const [sac, setSac] = useState("");
  const [locadoras, setLocadoras] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const locadorasRef = ref(database, "locadora");
    const unsubscribe = onValue(locadorasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locadorasArray = Object.keys(data).map((key) => ({
          key: key,
          cnpj: data[key].cnpj,
          nome: data[key].nome,
          site: data[key].site,
          sac: data[key].sac,
        }));
        setLocadoras(locadorasArray);
      } else {
        setLocadoras([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function create() {
    const database = getDatabase();
    const locadorasRef = ref(database, "locadora");
    const novaLocadoraRef = push(locadorasRef);

    set(novaLocadoraRef, {
      cnpj: cnpj,
      nome: nome,
      site: site,
      sac: sac,
    })
      .then(() => {
        console.log("Locadora cadastrada com sucesso");
        setCnpj("");
        setNome("");
        setSite("");
        setSac("");
      })
      .catch((error) => {
        console.log("Erro ao cadastrar locadora:", error);
      });
  }

  function update(locadoras, cnpj, nome, site, sac) {
    const database = getDatabase();
    const locadorasRef = ref(database, "locadora");
    const locadoraRef = ref(locadorasRef, locadoras.key);

    set(locadoraRef, {
      cnpj: cnpj,
      nome: nome,
      site: site,
      sac: sac,
    })
      .then(() => {
        console.log("Locadora atualizada com sucesso");
        setLocadoras((prevLocadoras) =>
          prevLocadoras.map((locadora) =>
            locadora.key === locadoras.key
              ? { ...locadora, cnpj, nome, site, sac }
              : locadora
          )
        );
        setCnpj("");
        setNome("");
        setSite("");
        setSac("");
      })
      .catch((error) => {
        console.log("Erro ao atualizar locadora:", error);
      });
  }

  function removeLocadora(locadora) {
    const database = getDatabase();
    const locadorasRef = ref(database, "locadora");
    const locadoraRef = ref(locadorasRef, locadora.key);

    remove(locadoraRef)
      .then(() => {
        console.log("Locadora removida com sucesso");
        setLocadoras((prevLocadoras) =>
          prevLocadoras.filter((loc) => loc.key !== locadora.key)
        );
      })
      .catch((error) => {
        console.log("Erro ao remover locadora:", error);
      });
  }

  return (
    <View>
      <TextInput
        style={styles.form}
        value={cnpj}
        onChangeText={setCnpj}
        placeholder="CNPJ"
      />
      <TextInput
        style={styles.form}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
      />
      <TextInput
        style={styles.form}
        value={site}
        onChangeText={setSite}
        placeholder="Site"
      />
      <TextInput
        style={styles.form}
        value={sac}
        onChangeText={setSac}
        placeholder="SAC"
      />
      <Button title="Cadastrar" onPress={create} />

      <Text style={styles.title}>Locadoras Cadastradas:</Text>
      {locadoras.length > 0 ? (
        locadoras.map((locadora) => (
          <View key={locadora.key} style={styles.locadoraContainer}>
            <Text>CNPJ: {locadora.cnpj}</Text>
            <Text>Nome: {locadora.nome}</Text>
            <Text>Site: {locadora.site}</Text>
            <Text>SAC: {locadora.sac}</Text>
            <Button
              title="Editar"
              onPress={() => update(locadora, cnpj, nome, site, sac)}
              color="#054f77"
            />
            <Button
              title="Excluir"
              onPress={() => removeLocadora(locadora)}
              color="#ff0000"
            />
          </View>
        ))
      ) : (
        <Text>Nenhuma locadora cadastrada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    fontSize: 20,
    marginVertical: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: "Roboto",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  locadoraContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});

export default Locadora;
