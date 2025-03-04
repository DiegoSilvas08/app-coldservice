import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import firebase from '../database/firebase';

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  // Obtener los usuarios de Firestore
  useEffect(() => {
    const unsubscribe = firebase.db.collection('usuarios').onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { name, email, phone } = doc.data();
        users.push({
          id: doc.id,
          name,
          email,
          phone,
        });
      });
      setUsers(users);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Eliminar un usuario
  const deleteUser = async (id) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            await firebase.db.collection('usuarios').doc(id).delete();
            Alert.alert('Usuario eliminado correctamente');
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
      {users.map((user) => (
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
      ))}
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
});

export default UserList;