import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import firebase from '../database/firebase'; // Importa firebase desde firebase.js

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await firebase.db.collection('usuarios').get();
        console.log('QuerySnapshot:', querySnapshot); // Depuración
        const users = [];
        querySnapshot.forEach((doc) => {
          console.log('Documento:', doc.id, doc.data()); // Depuración
          const { name, email, phone } = doc.data();
          users.push({
            id: doc.id,
            name,
            email,
            phone,
          });
        });
        console.log('Usuarios obtenidos:', users); // Depuración
        setUsers(users);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await firebase.db.collection('usuarios').doc(id).delete();
              Alert.alert('Usuario eliminado correctamente');
              // Actualiza la lista de usuarios después de eliminar
              setUsers(users.filter((user) => user.id !== id));
            } catch (error) {
              console.error('Error al eliminar usuario:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Button
        title="Crear Usuario"
        onPress={() => navigation.navigate('CreateUserScreen')}
      />
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No hay usuarios registrados.</Text>
      ) : (
        users.map((user) => (
          <View key={user.id} style={styles.userContainer}>
            <Text style={styles.text}>Nombre: {user.name}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Teléfono: {user.phone}</Text>
            <View style={styles.buttonsContainer}>
              <Button
                title="Editar"
                onPress={() =>
                  navigation.navigate('UserDetailScreen', { userId: user.id })
                }
              />
              <Button
                title="Eliminar"
                onPress={() => deleteUser(user.id)}
                color="#FF0000"
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  noUsersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default UserList;