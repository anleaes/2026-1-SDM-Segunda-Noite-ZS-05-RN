import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../config';

type Leilao = {
  id: number;
  produto: any;
  data_inicio: string;
  data_fim: string;
  status: string;
};

const LeiloesScreen = () => {
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
            <View style={styles.card}>
              <Text style={styles.nome}>
                {typeof item.produto === 'object' ? item.produto.nome : item.produto}
              </Text>
              <Text style={styles.status}>Status: {item.status.toUpperCase()}</Text>
              <Text style={styles.info}>📅 Fim: {new Date(item.data_fim).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  status: { color: '#4B7BE5', fontWeight: 'bold', marginVertical: 5 },
  info: { color: '#666' }
});

export default LeiloesScreen;