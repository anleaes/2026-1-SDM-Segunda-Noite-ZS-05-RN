import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import PessoasScreen from '../screens/PessoasScreen';
import EnderecosScreen from '../screens/EnderecosScreen';
import CadastroPessoaScreen from '../screens/CadastroPessoaScreen';
import CategoriasScreen from '../screens/CategoriasScreen';


export type DrawerParamList = {
  Home: undefined;
  Usuarios: undefined;
  Pessoas: undefined;
  Enderecos: undefined;
  CadastroPessoa: undefined;
  Categorias: undefined;
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
      <Drawer.Screen 
  name="Pessoas" 
  component={PessoasScreen} 
  options={{ title: 'Pessoas' }} 
      
/>
     <Drawer.Screen 
  name="Enderecos" 
  component={EnderecosScreen} 
  options={{ title: 'Endereços' }} 
/>
     <Drawer.Screen 
  name="CadastroPessoa" 
  component={CadastroPessoaScreen} 
  options={{ title: 'Novo Cadastro' }}
/>
  <Drawer.Screen 
  name="Categorias" 
  component={CategoriasScreen} // Certifique-se que você importou CategoriasScreen lá no topo!
  options={{ 
    title: 'Categorias',
    drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} /> 
  }}
/>
    </Drawer.Navigator> 
  
  );
};

export default DrawerNavigator;