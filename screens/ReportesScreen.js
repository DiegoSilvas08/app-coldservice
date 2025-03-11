import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa íconos
import firebase from '../database/firebase'; // Importa firebase como un objeto

const { db, firebase: firebaseInstance } = firebase; // Extrae db y firebase del objeto exportado

const ReportesScreen = ({ navigation }) => {
  const [clientName, setClientName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const estado = 'completado'; // Valor predeterminado

  const saveReport = async () => {
    if (!clientName || !serviceDescription || !date || !location) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      await db.collection('reportes').add({
        clientName,
        serviceDescription,
        date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
        location,
        estado,
        createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp(), // Usa firebaseInstance
      });

      Alert.alert('Éxito', 'El reporte se ha guardado correctamente.');
      setClientName('');
      setServiceDescription('');
      setDate(new Date());
      setLocation('');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el reporte:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Servicio</Text>

      {/* Campo: Nombre del Cliente */}
      <Text style={styles.label}>Nombre del Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre del cliente"
        placeholderTextColor="#999"
        value={clientName}
        onChangeText={setClientName}
      />

      {/* Campo: Descripción del Servicio */}
      <Text style={styles.label}>Descripción del Servicio</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe el servicio realizado"
        placeholderTextColor="#999"
        value={serviceDescription}
        onChangeText={setServiceDescription}
        multiline
      />

      {/* Campo: Fecha */}
      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Icon name="event" size={20} color="#fff" />
        <Text style={styles.dateButtonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Text style={styles.selectedDateText}>
        Fecha seleccionada: {date.toLocaleDateString()}
      </Text>

      {/* Campo: Ubicación */}
      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la ubicación"
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
      />

      {/* Botón para guardar el reporte */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={saveReport}>
          <Text style={styles.saveButtonText}>Guardar Reporte</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff', // Azul para las etiquetas
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // Azul para el botón de fecha
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007bff', // Azul para el botón de guardar
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportesScreen;