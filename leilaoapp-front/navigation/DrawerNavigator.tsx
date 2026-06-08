import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export type DrawerParamList = {
  Home: undefined;
  Usuarios: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#4B7BE5',
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerStyle: { backgroundColor: '#4B7BE5' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Drawer.Screen
     name="Usuarios"
     component={UsuariosScreen}
     options={{ 
         title: 'Usuários',
         drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />
     }}
   />
    </Drawer.Navigator>  
  );
};

export default DrawerNavigator;