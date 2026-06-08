import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../config';

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  valor_inicial: string;
  categoria: number;
  categoria_nome?: string; 
  vendedor: number;
  vendedor_nome?: string; 
};

const ProdutosScreen = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/produtos/`);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchProdutos(); }, []));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Disponíveis</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.nome}</Text>
              
              {/* Agora usa os campos que o Serializer envia ou mostra o ID como fallback */}
              <Text style={styles.info}>
                🏷️ Categoria: {item.categoria_nome || `ID ${item.categoria}`}
              </Text>
              <Text style={styles.info}>
                👤 Vendedor: {item.vendedor_nome || `ID ${item.vendedor}`}
              </Text>
              
              <Text style={styles.valor}>R$ {parseFloat(item.valor_inicial).toFixed(2)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum produto cadastrado.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#F9F9F9', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { fontSize: 14, color: '#666', marginBottom: 2 },
  valor: { fontSize: 16, fontWeight: 'bold', color: '#27AE60', marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' }
});

export default ProdutosScreen;