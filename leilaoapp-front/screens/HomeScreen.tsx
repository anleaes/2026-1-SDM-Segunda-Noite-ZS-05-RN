import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

const HomeScreen = ({ navigation }: any) => {
  const [stats, setStats] = useState({
    usuarios: 0,
    produtos: 0,
    leiloesAtivos: 0,
    lances: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resUsuarios, resProdutos, resLeiloes, resLances] = await Promise.all([
        fetch(`${API_URL}/usuarios/`),
        fetch(`${API_URL}/produtos/`),
        fetch(`${API_URL}/leiloes/`),
        fetch(`${API_URL}/lances/`)
      ]);

      const usuarios = resUsuarios.ok ? await resUsuarios.json() : [];
      const produtos = resProdutos.ok ? await resProdutos.json() : [];
      const leiloes = resLeiloes.ok ? await resLeiloes.json() : [];
      const lances = resLances.ok ? await resLances.json() : [];

      const ativos = leiloes.filter((l: any) => l.status === 'ativo' || l.status === 'ATIVO').length;

      setStats({
        usuarios: usuarios.length || 0,
        produtos: produtos.length || 0,
        leiloesAtivos: ativos || 0,
        lances: lances.length || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchDashboardData(); }, []));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Bem vindo ao Sistema de Leilões!!</Text>
        <Text style={styles.subtitle}>Resumo dos Leilões</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.grid}>
          <TouchableOpacity 
            style={[styles.card, { borderLeftColor: '#4B7BE5' }]} 
            onPress={() => navigation.navigate('Usuarios')}
          >
            <Text style={styles.cardTitle}>Usuários</Text>
            <Text style={[styles.cardValue, { color: '#4B7BE5' }]}>{stats.usuarios}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { borderLeftColor: '#9B59B6' }]} 
            onPress={() => navigation.navigate('Produtos')}
          >
            <Text style={styles.cardTitle}>Produtos</Text>
            <Text style={[styles.cardValue, { color: '#9B59B6' }]}>{stats.produtos}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { borderLeftColor: '#27AE60' }]} 
            onPress={() => navigation.navigate('Leiloes')}
          >
            <Text style={styles.cardTitle}>Leilões Ativos</Text>
            <Text style={[styles.cardValue, { color: '#27AE60' }]}>{stats.leiloesAtivos}</Text>
          </TouchableOpacity>

          <View style={[styles.card, { borderLeftColor: '#E67E22' }]}>
            <Text style={styles.cardTitle}>Lances Realizados</Text>
            <Text style={[styles.cardValue, { color: '#E67E22' }]}>{stats.lances}</Text>
          </View>
        </View>
      )}

      {!loading && (
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CadastroLeilao')}>
            <Text style={styles.actionButtonText}>+ Criar Novo Leilão</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={() => navigation.navigate('CadastroProduto')}>
            <Text style={styles.actionButtonTextSecondary}>+ Cadastrar Produto</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { backgroundColor: '#4B7BE5', padding: 20, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#e0eaff' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
  card: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2, borderLeftWidth: 5 },
  cardTitle: { fontSize: 14, color: '#666', fontWeight: 'bold', marginBottom: 10 },
  cardValue: { fontSize: 32, fontWeight: 'bold' },
  
  actionsContainer: { paddingHorizontal: 16, marginTop: 10, marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  actionButton: { backgroundColor: '#4B7BE5', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10, elevation: 1 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  actionButtonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#4B7BE5' },
  actionButtonTextSecondary: { color: '#4B7BE5', fontSize: 16, fontWeight: 'bold' }
});

export default HomeScreen;