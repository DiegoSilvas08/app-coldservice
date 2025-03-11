import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider

// Importa las pantallas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserList from './screens/UserList';
import CreateUserScreen from './screens/CreateUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import ReportesScreen from './screens/ReportesScreen';
import ConsultarReportesScreen from './screens/ConsultarReportesScreen';

// Crea el navegador de pila
const Stack = createNativeStackNavigator();

// Define la pila de navegación
function MyStack() {
  return (
    <Stack.Navigator>
      {/* Pantalla de inicio de sesión */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }} // Oculta el header en LoginScreen
      />

      {/* Pantalla principal */}
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Home Screen' }} // Personaliza el título
      />

      {/* Otras pantallas */}
      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{ title: 'Lista de Usuarios' }}
      />
      <Stack.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: 'Crear Usuario' }}
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ title: 'Detalle del Usuario' }}
      />
      <Stack.Screen
        name="ReportesScreen"
        component={ReportesScreen}
        options={{ title: 'Reportes de Servicio' }}
      />
      <Stack.Screen
        name="ConsultarReportesScreen"
        component={ConsultarReportesScreen}
        options={{ title: 'Consultar Reportes' }}
      />
    </Stack.Navigator>
  );
}

// Componente principal de la aplicación
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AuthProvider>
  );
}