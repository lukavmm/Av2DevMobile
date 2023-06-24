import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  remove,
} from "firebase/database";

export function Usuario() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [showUsers, setShowUsers] = useState(false); // Estado para controlar a exibição dos usuários

  function validateCPF(cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }

  async function checkCPFExists(cpf) {
    const db = getDatabase();
    const userRef = ref(db, `user/${cpf}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  }

  async function createUser() {
    if (!validateCPF(cpf)) {
      console.log("CPF inválido");
      return;
    }

    const formattedCPF = cpf.replace(/\D/g, ""); // Remove non-digit characters from CPF

    const cpfExists = await checkCPFExists(formattedCPF);
    if (cpfExists) {
      console.log("CPF já existe");
      return;
    }

    const db = getDatabase();
    set(ref(db, `user/${formattedCPF}`), {
      name: username,
      email: email,
      cpf: formattedCPF,
    })
      .then(() => {
        console.log("Dados enviados");
        // Limpar os campos do formulário
        setUsername("");
        setEmail("");
        setCpf("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function updateUser() {
    if (!validateCPF(cpf)) {
      console.log("CPF inválido");
      return;
    }

    const formattedCPF = cpf.replace(/\D/g, ""); // Remove non-digit characters from CPF

    const db = getDatabase();
    set(ref(db, `user/${formattedCPF}`), {
      name: username,
      email: email,
      cpf: formattedCPF,
    })
      .then(() => {
        console.log("Dados atualizados");
        // Limpar os campos do formulário
        setUsername("");
        setEmail("");
        setCpf("");
        setUserId("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function deleteUser() {
    const db = getDatabase();
    remove(ref(db, `user/${userId}`))
      .then(() => {
        console.log("Usuário removido");
        // Limpar os campos do formulário
        setUsername("");
        setEmail("");
        setCpf("");
        setUserId("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getUsers() {
    const db = getDatabase();
    const usersRef = ref(db, "user");

    setUsers([]); // Limpar a lista de usuários antes de buscar novamente

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList = Object.values(usersData);
        setUsers(usersList);
      }
    });
  }

  useEffect(() => {
    if (showUsers) {
      getUsers();
    }
  }, [showUsers]); // Fetch users when showUsers changes

  return (
    <View>
      <TextInput
        style={styles.form}
        value={username}
        onChangeText={setUsername}
        placeholder="Nome completo"
      />
      <TextInput
        style={styles.form}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.form}
        value={cpf}
        onChangeText={setCpf}
        placeholder="CPF (Formato: 123.456.789-10)"
      />
      <Button style={styles.botao} title="Enviar" onPress={createUser} />
      <Button style={styles.botao} title="Atualizar" onPress={updateUser} />
      <Button style={styles.botao} title="Deletar" onPress={deleteUser} />
      <Button
        style={styles.botao}
        title="Mostrar Usuários"
        onPress={() => setShowUsers(true)}
      />
      {showUsers && (
        <>
          <Text style={styles.title}>Usuários Cadastrados:</Text>
          <View>
            {users.map((user, index) => (
              <Text
                key={index}
                onPress={() => {
                  setUsername(user.name);
                  setEmail(user.email);
                  setCpf(user.cpf);
                  setUserId(user.cpf);
                }}
                style={styles.userItem}
              >
                {user.name}
              </Text>
            ))}
          </View>
        </>
      )}
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
  botao: {
    borderRadius: 7,
    margin: "5px",
    backgroundColor: "#054f77",
    fontFamily: "Roboto",
    color: "white",
    padding: 14,
    fontSize: 15,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});

export default Usuario;
