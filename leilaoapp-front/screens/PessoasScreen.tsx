import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../config';

// Tipagem baseada nos atributos esperados para Pessoa
export type Pessoa = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
};

const PessoasScreen = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPessoas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pessoas/`);
      const data = await response.json();
      setPessoas(data);
    } catch (error) {
      console.error("Erro ao buscar pessoas do Django:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPessoas();
    }, [])
  );

  const renderItem = ({ item }: { item: Pessoa }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.info}>📧 Email: {item.email}</Text>
      <Text style={styles.info}>🆔 CPF: {item.cpf}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pessoas Cadastradas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#8E44AD" />
      ) : (
        <FlatList
          data={pessoas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma pessoa encontrada.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333', alignSelf: 'center' },
  card: { backgroundColor: '#F4ECF7', padding: 16, borderRadius: 10, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#8E44AD', elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' }
});

export default PessoasScreen;