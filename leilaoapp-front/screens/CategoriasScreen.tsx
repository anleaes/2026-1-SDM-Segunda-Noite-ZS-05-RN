import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../config';

export type Categoria = {
  id: number;
  nome: string;
  descricao: string;
  codigo_setor: number;
  destaque: boolean;
};

const CategoriasScreen = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/categorias/`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias do Django:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategorias();
    }, [])
  );

  const renderItem = ({ item }: { item: Categoria }) => (
    <View style={[styles.card, item.destaque && styles.cardDestaque]}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.nome}</Text>
        {item.destaque && <Text style={styles.star}>⭐ Destaque</Text>}
      </View>
      <Text style={styles.info}>{item.descricao}</Text>
      <Text style={styles.setor}>🏷️ Setor: {item.codigo_setor}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias de Leilão</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#E67E22" />
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma categoria encontrada.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333', alignSelf: 'center' },
  card: { backgroundColor: '#FDF2E9', padding: 16, borderRadius: 10, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#E67E22', elevation: 2 },
  cardDestaque: { backgroundColor: '#FEF9E7', borderLeftColor: '#F1C40F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222', flex: 1 },
  star: { fontSize: 12, fontWeight: 'bold', color: '#D4AC0D', backgroundColor: '#FEF5E7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  info: { fontSize: 14, color: '#555', marginTop: 2, marginBottom: 6 },
  setor: { fontSize: 13, fontWeight: 'bold', color: '#E67E22' },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' }
});

export default CategoriasScreen;
