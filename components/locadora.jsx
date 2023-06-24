import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "./config";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  push,
  child,
  update,
} from "firebase/database";

export function Locadora() {
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [site, setSite] = useState("");
  const [sac, setSac] = useState("");
  const [locadoras, setLocadoras] = useState([]);
  const novoCnpjInput = useRef(null);
  const novoNomeInput = useRef(null);
  const novoSiteInput = useRef(null);
  const novoSacInput = useRef(null);

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

  function updateLocadora(locadora, cnpj, nome, site, sac) {
    if (typeof locadora.key !== "string" || locadora.key.trim() === "") {
      console.log("Chave inválida da locadora");
      return;
    }

    const database = getDatabase();
    const locadorasRef = ref(database, "locadora");
    const locadoraRef = child(locadorasRef, locadora.key);

    update(locadoraRef, {
      cnpj: cnpj,
      nome: nome,
      site: site,
      sac: sac,
    })
      .then(() => {
        console.log("Locadora atualizada com sucesso");
        setLocadoras((prevLocadoras) =>
          prevLocadoras.map((loc) =>
            loc.key === locadora.key ? { ...loc, cnpj, nome, site, sac } : loc
          )
        );
      })
      .catch((error) => {
        console.log("Erro ao atualizar locadora:", error);
      });
  }

  function removeLocadora(locadora) {
    const database = getDatabase();
    const locadorasRef = ref(database, "locadora");
    const locadoraRef = child(locadorasRef, locadora.key);

    remove(locadoraRef)
      .then(() => {
        console.log("Locadora removida com sucesso");
      })
      .catch((error) => {
        console.log("Erro ao remover locadora:", error);
      });
  }

  function handleUpdateClick(locadora) {
    // Obter os novos valores dos campos de texto
    const novoCnpj = novoCnpjInput.current.value;
    const novoNome = novoNomeInput.current.value;
    const novoSite = novoSiteInput.current.value;
    const novoSac = novoSacInput.current.value;

    // Chamar a função updateLocadora com os novos valores
    updateLocadora(locadora, novoCnpj, novoNome, novoSite, novoSac);
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
            <TextInput
              ref={novoCnpjInput}
              defaultValue={locadora.cnpj}
              style={styles.form}
              placeholder="Novo CNPJ"
            />
            <TextInput
              ref={novoNomeInput}
              defaultValue={locadora.nome}
              style={styles.form}
              placeholder="Novo Nome"
            />
            <TextInput
              ref={novoSiteInput}
              defaultValue={locadora.site}
              style={styles.form}
              placeholder="Novo Site"
            />
            <TextInput
              ref={novoSacInput}
              defaultValue={locadora.sac}
              style={styles.form}
              placeholder="Novo SAC"
            />
            <Button
              title="Editar"
              onPress={() => handleUpdateClick(locadora)}
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
