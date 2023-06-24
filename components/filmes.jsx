import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ref, onValue, update } from "firebase/database";
import { db } from "./config";

export function Filmes() {
  const [filmes, setFilmes] = useState([]);
  const [selectedFilmeId, setSelectedFilmeId] = useState(null);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filmesRef = ref(db, "filme");
    onValue(filmesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filmesList = Object.entries(data).map(([id, filme]) => ({
          id,
          ...filme,
          clienteId: filme.clienteId || null,
        }));
        setFilmes(filmesList);
      }
    });
  }, []);

  const handleExcluirFilme = (filmeId) => {
    const filmeRef = ref(db, `filme/${filmeId}`);
    update(filmeRef, { clienteId: null })
      .then(() => {
        console.log("Filme excluído com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao excluir filme:", error);
      });
  };

  const handleAssociarCliente = (filmeId) => {
    setSelectedFilmeId(filmeId);
    setShowModal(true);
  };

  const handleSelecionarCliente = (clienteId) => {
    const filmeRef = ref(db, `filme/${selectedFilmeId}`);
    update(filmeRef, { clienteId })
      .then(() => {
        console.log("Cliente associado ao filme com sucesso!");
        setSelectedFilmeId(null);
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Erro ao associar cliente ao filme:", error);
      });
  };

  const handleFecharModal = () => {
    setShowModal(false);
  };

  return (
    <View>
      <Text>Lista de Filmes:</Text>
      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleExcluirFilme(item.id)}>
            <View>
              <Text>{item.titulo}</Text>
              {item.clienteId ? (
                <Text>Cliente: {item.clienteId}</Text>
              ) : (
                <Button
                  title="Associar Cliente"
                  onPress={() => handleAssociarCliente(item.id)}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal visible={showModal}>
        <View>
          <Text>Conteúdo do modal</Text>
          <Button
            title="Selecionar Cliente"
            onPress={() => handleSelecionarCliente(selectedClienteId)}
          />
          <Button title="Fechar" onPress={handleFecharModal} />
        </View>
      </Modal>
    </View>
  );
}
