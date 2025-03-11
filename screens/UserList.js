import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para el sobre, tuerca y bote de basura
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Para WhatsApp
import firebase from '../database/firebase';

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await firebase.db.collection('usuarios').get();
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

  // Función para abrir Gmail
  const handleEmailPress = (email) => {
    const subject = 'Consulta desde la app'; // Asunto del correo
    const body = 'Hola, me gustaría contactarte.'; // Cuerpo del correo
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la aplicación de correo.');
    });
  };

  // Función para abrir WhatsApp
  const handleWhatsAppPress = (phone) => {
    Linking.openURL(`https://wa.me/${phone}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp.');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateUserScreen')}
      >
        <Text style={styles.createButtonText}>Crear Usuario</Text>
      </TouchableOpacity>
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No hay usuarios registrados.</Text>
      ) : (
        users.map((user) => (
          <View key={user.id} style={styles.userContainer}>
            <Text style={styles.text}>Nombre: {user.name}</Text>

            {/* Ícono de sobre para el email */}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleEmailPress(user.email)}
            >
              <Icon name="email" size={24} color="#007BFF" />
              <Text style={styles.iconText}>{user.email}</Text>
            </TouchableOpacity>

            {/* Ícono de WhatsApp para el teléfono */}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => handleWhatsAppPress(user.phone)}
            >
              <FontAwesome name="whatsapp" size={24} color="#25D366" />
              <Text style={styles.iconText}>{user.phone}</Text>
            </TouchableOpacity>

            {/* Botones de editar y eliminar */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate('UserDetailScreen', { userId: user.id })
                }
              >
                <Icon name="settings" size={24} color="#007BFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => deleteUser(user.id)}
              >
                <Icon name="delete" size={24} color="#FF0000" />
              </TouchableOpacity>
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
  createButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
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
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#007BFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    marginLeft: 15,
  },
  noUsersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default UserList;