import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import firebase from '../database/firebase';

const { db } = firebase;

const ConsultarReportesScreen = ({ route }) => {
  const { userRole } = route.params; // Obtén el rol del usuario
  const [reportes, setReportes] = useState([]); // Estado para almacenar los reportes
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [showOptions, setShowOptions] = useState({}); // Estado para controlar la visibilidad de las opciones

  // Obtener los reportes desde Firestore
  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const querySnapshot = await db.collection('reportes').get();
        const reportesData = [];
        querySnapshot.forEach((doc) => {
          reportesData.push({ id: doc.id, ...doc.data() });
        });
        setReportes(reportesData);
      } catch (error) {
        console.error('Error al obtener los reportes:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los reportes.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  // Función para actualizar el estado de un reporte (solo para admin)
  const updateEstado = async (id, nuevoEstado) => {
    if (userRole !== 'admin') {
      Alert.alert('Error', 'No tienes permisos para cambiar el estado.');
      return;
    }

    try {
      await db.collection('reportes').doc(id).update({ estado: nuevoEstado });
      // Actualiza el estado localmente
      setReportes((prevReportes) =>
        prevReportes.map((reporte) =>
          reporte.id === id ? { ...reporte, estado: nuevoEstado } : reporte
        )
      );
      Alert.alert('Éxito', 'El estado del reporte se ha actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el estado.');
    }
  };

  // Función para mostrar/ocultar las opciones de cambio de estado
  const toggleOptions = (id) => {
    setShowOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reportes Generados</Text>

      {reportes.length === 0 ? (
        <Text style={styles.noReportesText}>No hay reportes registrados.</Text>
      ) : (
        reportes.map((reporte) => (
          <View key={reporte.id} style={styles.reporteContainer}>
            <Text style={styles.label}>Nombre del Cliente: {reporte.clientName}</Text>
            <Text style={styles.label}>Descripción: {reporte.serviceDescription}</Text>
            <Text style={styles.label}>Fecha: {reporte.date}</Text>
            <Text style={styles.label}>Ubicación: {reporte.location}</Text>
            <Text style={styles.label}>Estado Actual: {reporte.estado || 'proceso'}</Text>

            {/* Botón para mostrar/ocultar las opciones de cambio de estado (solo para admin) */}
            {userRole === 'admin' && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => toggleOptions(reporte.id)}
              >
                <Text style={styles.buttonText}>Cambiar Estado</Text>
              </TouchableOpacity>
            )}

            {/* Mostrar opciones de cambio de estado si están visibles (solo para admin) */}
            {showOptions[reporte.id] && userRole === 'admin' && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => updateEstado(reporte.id, 'proceso')}
                >
                  <Text style={styles.optionButtonText}>Proceso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => updateEstado(reporte.id, 'completado')}
                >
                  <Text style={styles.optionButtonText}>Completado</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => updateEstado(reporte.id, 'pagado')}
                >
                  <Text style={styles.optionButtonText}>Pagado</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Mostrar fotos (si existen) */}
            {reporte.photos && reporte.photos.length > 0 && (
              <ScrollView horizontal style={styles.photosContainer}>
                {reporte.photos.map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.photo} />
                ))}
              </ScrollView>
            )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reporteContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  optionButtonText: {
    fontSize: 16,
    color: '#000',
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  noReportesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConsultarReportesScreen;