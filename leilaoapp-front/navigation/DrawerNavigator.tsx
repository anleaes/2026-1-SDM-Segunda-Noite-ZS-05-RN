import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import PessoasScreen from '../screens/PessoasScreen';
import EnderecosScreen from '../screens/EnderecosScreen';
import CadastroPessoaScreen from '../screens/CadastroPessoaScreen';
import CadastroProdutoScreen from '../screens/CadastroProdutoScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import LeiloesScreen from '../screens/LeiloesScreen';
import DetalheLeilaoScreen from '../screens/DetalheLeilaoScreen';
import ListaLancesScreen from '../screens/ListaLancesScreen';
import CadastroLeilaoScreen from '../screens/CadastroLeilaoScreen';

export type DrawerParamList = {
  Home: undefined;
  Usuarios: undefined;
  Pessoas: undefined;
  Enderecos: undefined;
  CadastroPessoa: undefined;
  CadastroProduto: undefined;
  Produtos: undefined;
  Leiloes: undefined;
  CadastroLeilao: undefined;
  DetalheLeilao: { leilaoId: number; produtoNome: string; valorAtual: string };
  ListaLances: { leilaoId: number; produtoNome: string; valorAtual: string };
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
        name="CadastroProduto" 
        component={CadastroProdutoScreen} 
        options={{ title: 'Novo Produto' }} 
      />
      <Drawer.Screen 
        name="Produtos" 
        component={ProdutosScreen} 
        options={{ title: 'Produtos' }} 
      />
      <Drawer.Screen 
        name="Leiloes" 
        component={LeiloesScreen} 
        options={{ title: 'Leilões' }} 
      />

      {/* Telas internas, ocultas do menu lateral */}
      <Drawer.Screen 
        name="DetalheLeilao" 
        component={DetalheLeilaoScreen}
        options={{ title: 'Dar Lance', drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen 
        name="ListaLances" 
        component={ListaLancesScreen}
        options={{ title: 'Histórico de Lances', drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen 
  name="CadastroLeilao" 
  component={CadastroLeilaoScreen} 
  options={{ title: 'Novo Leilão' }} 
/>
    </Drawer.Navigator>  
  );
};

export default DrawerNavigator;