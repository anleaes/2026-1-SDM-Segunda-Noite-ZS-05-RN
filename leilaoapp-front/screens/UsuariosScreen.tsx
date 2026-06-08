import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../config';

// Tipagem atualizada com os novos campos vindos do Django
export type Usuario = {
  id: number;
  perfil: string;
  ativo: boolean;
  pontuacao: number;
  cpf: string;
  pessoa: number;
  pessoa_nome?: string;      // Campo injetado pelo serializer
  pessoa_sobrenome?: string; // Campo injetado pelo serializer
};

const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuarios/`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários do Django:", error);
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
      {/* Exibe o nome associado se ele existir, caso contrário mostra o ID da FK */}
      <Text style={styles.name}>
        👤 {item.pessoa_nome ? `${item.pessoa_nome} ${item.pessoa_sobrenome}` : `Usuário ID: ${item.id}`}
      </Text>
      
      <Text style={styles.info}>🪪 CPF: {item.cpf}</Text>
      <Text style={styles.info}>💼 Perfil: {item.perfil.toUpperCase()}</Text>
      <Text style={styles.info}>🏆 Pontuação: {item.pontuacao} pts</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.info}>Status: </Text>
        <Text style={[styles.statusText, item.ativo ? styles.statusAtivo : styles.statusInativo]}>
          {item.ativo ? 'ATIVO' : 'INATIVO'}
        </Text>
      </View>
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
  container: { flex: 1, backgroundColor: '#F5F0E6', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333', alignSelf: 'center' },
  card: { backgroundColor: '#F5F0E6', padding: 16, borderRadius: 10, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#CB9B3C', elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 6 },
  info: { fontSize: 14, color: '#555', marginTop: 3 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusAtivo: { backgroundColor: '#D4EFDF', color: '#196F3D' },
  statusInativo: { backgroundColor: '#FADBD8', color: '#943126' },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' }
});

export default UsuariosScreen;

//marrom #4B2E1E -- dourado #CB9B3C -- creme #F5F0E6