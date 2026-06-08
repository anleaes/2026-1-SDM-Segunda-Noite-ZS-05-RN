import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'Usuarios'>;

// Tipagem baseada nos atributos da sua classe Usuario
export type Usuario = {
  id: number;
  ativo: boolean;
  pontuacao: number;
  cpf: string;
  perfil: string;
  pessoa: number; // ID da pessoa vinculada
};

const UsuariosScreen = ({ navigation }: Props) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/usuarios/');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [])
  );

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Perfil: {item.perfil}</Text>
      <Text style={styles.info}>CPF: {item.cpf}</Text>
      <Text style={styles.info}>Pontuação: {item.pontuacao}</Text>
      <Text style={styles.status}>
        Status: {item.ativo ? 'Ativo 🟢' : 'Inativo 🔴'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários do Sistema</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333', alignSelf: 'center' },
  card: { backgroundColor: '#f0f4ff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 18, fontWeight: '600', color: '#222', textTransform: 'capitalize' },
  info: { fontSize: 14, color: '#666', marginTop: 4 },
  status: { fontSize: 14, fontWeight: 'bold', color: '#4B7BE5', marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' }
});

export default UsuariosScreen;