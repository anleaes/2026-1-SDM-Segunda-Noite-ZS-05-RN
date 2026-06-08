import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

type Leilao = {
  id: number;
  produto: number;
  produto_nome?: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  valor_minimo: string;
};

const LeiloesScreen = ({ navigation }: any) => {
  const [leiloes, setLeiloes] = useState<Leilao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeiloes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/leiloes/`);
      const data = await response.json();
      setLeiloes(data);
    } catch (error) {
      console.error("Erro ao buscar leilões:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLeiloes(); }, []));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leilões em Andamento</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={leiloes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              // MUDANÇA AQUI: Redirecionando para ListaLances
              onPress={() => navigation.navigate('ListaLances', { 
                leilaoId: item.id, 
                produtoNome: item.produto_nome || `Produto ID: ${item.produto}`,
                valorAtual: item.valor_minimo
              })}
            >
              <Text style={styles.nome}>
                {item.produto_nome || `Produto ID: ${item.produto}`}
              </Text>
              <Text style={styles.status}>Status: {item.status.toUpperCase()}</Text>
              <Text style={styles.info}>📅 Fim: {new Date(item.data_fim).toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F0E6' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { padding: 16, backgroundColor: '#F5F0E6', borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#4B2E1E' },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#4B2E1E' },
  status: { color: '#4B2E1E', fontWeight: 'bold', marginVertical: 5 },
  info: { color: '#666' }
});

export default LeiloesScreen;

//marrom #4B2E1E -- dourado #CB9B3C -- creme #F5F0E6