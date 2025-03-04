import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '../database/firebase';

const { db } = firebase;

const UserDetailScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState({ name: '', email: '', phone: '' });

  // Obtener los datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const doc = await firebase.db.collection('usuarios').doc(userId).get();
      if (doc.exists) {
        setUser(doc.data());
      }
    };
    fetchUser();
  }, [userId]);

  // Actualizar el usuario
  const updateUser = async () => {
    await firebase.db.collection('usuarios').doc(userId).update(user);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={user.phone}
        onChangeText={(text) => setUser({ ...user, phone: text })}
      />
      <Button title="Actualizar Usuario" onPress={updateUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default UserDetailScreen;