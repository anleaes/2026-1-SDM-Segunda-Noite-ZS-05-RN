import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../config';

// Tipagem baseada nos atributos esperados para Endereco
export type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

const EnderecosScreen = () => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnderecos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/enderecos/`);
      const data = await response.json();
      setEnderecos(data);
    } catch (error) {
      console.error("Erro ao buscar endereços do Django:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnderecos();
    }, [])
  );

  const renderItem = ({ item }: { item: Endereco }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.logradouro}, {item.numero}</Text>
      <Text style={styles.info}>Bairro: {item.bairro}</Text>
      <Text style={styles.info}>{item.cidade} - {item.estado}</Text>
      <Text style={styles.cep}>📍 CEP: {item.cep}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Endereços Cadastrados</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2ECC71" />
      ) : (
        <FlatList
          data={enderecos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum endereço encontrado.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333', alignSelf: 'center' },
  card: { backgroundColor: '#F0FFF4', padding: 16, borderRadius: 10, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#2ECC71', elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  cep: { fontSize: 14, fontWeight: 'bold', color: '#2ECC71', marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' }
});

export default EnderecosScreen;