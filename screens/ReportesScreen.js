import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, FieldValue } from '../database/firebase';

const ReportesScreen = ({ navigation }) => {
  const [clientName, setClientName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir el acceso a la galería para seleccionar fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0]]); // Agrega la foto seleccionada al estado
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = storage.ref(`servicePhotos/${Date.now()}`);
      await storageRef.put(blob);
      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la foto:', error);
      Alert.alert('Error', 'Hubo un problema al subir la foto.');
      return null;
    }
  };

  const saveReport = async () => {
    if (!clientName || !serviceDescription || !date || !location) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const photoURLs = await Promise.all(photos.map((photo) => uploadImage(photo.uri)));
      await db.collection('reportes').add({
        clientName,
        serviceDescription,
        date,
        location,
        photos: photoURLs,
        createdAt: FieldValue.serverTimestamp(),
      });

      Alert.alert('Éxito', 'El reporte se ha guardado correctamente.');
      setClientName('');
      setServiceDescription('');
      setDate('');
      setLocation('');
      setPhotos([]);
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el reporte:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Servicio</Text>

      <Text style={styles.label}>Nombre del Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre del cliente"
        value={clientName}
        onChangeText={setClientName}
      />

      <Text style={styles.label}>Descripción del Servicio</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe el servicio realizado"
        value={serviceDescription}
        onChangeText={setServiceDescription}
        multiline
      />

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la fecha (DD/MM/AAAA)"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la ubicación"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Fotos</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>Seleccionar Fotos</Text>
      </TouchableOpacity>

      <View style={styles.photosContainer}>
        {photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo.uri }} style={styles.photo} />
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Guardar Reporte" onPress={saveReport} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
});

export default ReportesScreen;