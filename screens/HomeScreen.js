import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../database/firebase'; // Importa auth para cerrar sesión

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('LoginScreen'); // Redirige a LoginScreen después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Título de la Aplicación */}
      <Text style={styles.header}>Cold Service</Text>

      {/* Botón de Reportes y Estadísticas */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ReportesScreen')} // Nombre corregido
      >
        <Text style={styles.buttonText}>Reportes y Estadísticas</Text>
      </TouchableOpacity>

      {/* Botón de Empleados */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EmpleadosScreen')} // Nombre corregido
      >
        <Text style={styles.buttonText}>Empleados</Text>
      </TouchableOpacity>

      {/* Botón de Servicio */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserList')}
      >
        <Text style={styles.buttonText}>Servicio</Text>
      </TouchableOpacity>

      {/* Botón de WhatsApp */}
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => Linking.openURL('https://wa.me/+526621829724')}
      >
        <FontAwesome name="whatsapp" size={24} color="green" />
      </TouchableOpacity>

      {/* Botón de Atrás (cierra sesión y redirige a LoginScreen) */}
      <TouchableOpacity
        style={styles.backButtonBottom}
        onPress={handleLogout} // Cierra sesión y redirige
      >
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#25D366',
    borderRadius: 50,
  },
  backButtonBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 50,
  },
});

export default HomeScreen;