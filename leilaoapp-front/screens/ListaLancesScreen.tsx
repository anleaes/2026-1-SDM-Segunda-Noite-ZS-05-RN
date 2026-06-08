import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

const ListaLancesScreen = ({ route, navigation }: any) => {
  const { leilaoId, produtoNome, valorAtual } = route.params || {};
  const [lances, setLances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/lances/`);
      const data = await response.json();
      
      // Filtra os lances para mostrar apenas os deste leilão específico
      const lancesDesteLeilao = data.filter((lance: any) => lance.leilao === leilaoId);
      
      // Ordena para os lances mais altos aparecerem primeiro
      lancesDesteLeilao.sort((a: any, b: any) => parseFloat(b.valor) - parseFloat(a.valor));
      
      setLances(lancesDesteLeilao);
    } catch (error) {
      console.error("Erro ao buscar lances:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchLances(); }, []));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{produtoNome}</Text>
      <Text style={styles.subtitle}>Histórico de Lances</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" style={{ marginTop: 20 }} />
      ) : lances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum lance recebido ainda.</Text>
          <Text style={styles.emptySubtext}>Seja o primeiro a dar um lance para este produto!</Text>
        </View>
      ) : (
        <FlatList
          data={lances}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.lanceCard, index === 0 && styles.maiorLanceCard]}>
              <View>
                <Text style={styles.lanceValor}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
                <Text style={styles.lanceComprador}>Comprador ID: {item.comprador}</Text>
              </View>
              {index === 0 && <Text style={styles.badgeMaiorLance}>Maior Lance</Text>}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Botão que leva para a tela que fizemos anteriormente */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('DetalheLeilao', { 
          leilaoId, 
          produtoNome, 
          valorAtual 
        })}
      >
        <Text style={styles.buttonText}>Fazer um Lance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F0E6' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#888', textAlign: 'center' },
  
  lanceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#F5F0E6', borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  maiorLanceCard: { borderColor: '#CB9B3C', backgroundColor: '#F5F0E6' },
  lanceValor: { fontSize: 18, fontWeight: 'bold', color: '#CB9B3C' },
  lanceComprador: { fontSize: 12, color: '#4B2E1E', marginTop: 4 },
  badgeMaiorLance: { backgroundColor: '#CB9B3C', color: '#4B2E1E', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
  
  button: { backgroundColor: '#CB9B3C', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 'auto' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ListaLancesScreen;

//marrom #4B2E1E -- dourado #CB9B3C -- creme #F5F0E6