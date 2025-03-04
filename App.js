import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa las pantallas
import UserList from './screens/UserList';
import CreateUserScreen from './screens/CreateUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ReportesScreen from './screens/ReportesScreen';

// Crea el navegador de pila
const Stack = createNativeStackNavigator();

// Define la pila de navegación
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: 'Login Screen' }} // Personaliza el título
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Home Screen' }} // Personaliza el título
      />
      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{ title: 'Lista de Usuarios' }} // Personaliza el título
      />
      <Stack.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: 'Crear Usuario' }} // Personaliza el título
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ title: 'Detalle del Usuario' }} // Personaliza el título
      />
      <Stack.Screen
        name="ReportesScreen" // Nombre de la pantalla
        component={ReportesScreen}
        options={{ title: 'Reportes de Servicio' }}
      />
    </Stack.Navigator>
  );
}

// Componente principal de la aplicación
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}