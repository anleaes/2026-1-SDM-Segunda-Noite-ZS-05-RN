import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

const CadastroLeilaoScreen = ({ navigation }: any) => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [valorMinimo, setValorMinimo] = useState('');
  const [dataInicio, setDataInicio] = useState('2026-06-08T18:00:00-03:00'); // Sugestão de formato ISO
  const [dataFim, setDataFim] = useState('2026-07-08T18:00:00-03:00');
  
  const [statusAviso, setStatusAviso] = useState({ tipo: '', mensagem: '' });

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch(`${API_URL}/produtos/`);
        const data = await response.json();
        setProdutos(data);
        if (data.length > 0) setProdutoSelecionado(data[0].id);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoadingProdutos(false);
      }
    };
    fetchProdutos();
  }, []);

  const extrairErro = async (resposta: Response) => {
    try {
      const json = await resposta.json();
      return JSON.stringify(json, null, 2);
    } catch {
      return await resposta.text();
    }
  };

  const handleSalvarLeilao = async () => {
    if (!produtoSelecionado || !valorMinimo) {
      setStatusAviso({ tipo: 'erro', mensagem: 'Selecione um produto e defina o valor mínimo.' });
      return;
    }

    setStatusAviso({ tipo: 'loading', mensagem: 'Criando leilão...' });

    try {
      const response = await fetch(`${API_URL}/leiloes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          produto: produtoSelecionado,
          valor_minimo: parseFloat(valorMinimo.replace(',', '.')),
          data_inicio: dataInicio,
          data_fim: dataFim,
          status: 'ativo'
        }),
      });

      if (!response.ok) {
        const erroDetalhado = await extrairErro(response);
        setStatusAviso({ tipo: 'erro', mensagem: `Erro ao criar leilão:\n${erroDetalhado}` });
        return;
      }

      setStatusAviso({ tipo: 'sucesso', mensagem: 'Leilão criado com sucesso!' });
      setTimeout(() => navigation.navigate('Leiloes'), 1500);

    } catch (error: any) {
      setStatusAviso({ tipo: 'erro', mensagem: `Erro de conexão: ${error.message}` });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {statusAviso.tipo !== '' && (
        <View style={[styles.avisoCaixa, statusAviso.tipo === 'erro' ? styles.avisoErro : statusAviso.tipo === 'sucesso' ? styles.avisoSucesso : styles.avisoLoading]}>
          <Text style={styles.avisoTexto}>{statusAviso.mensagem}</Text>
        </View>
      )}

      <Text style={styles.label}>Selecione o Produto</Text>
      {loadingProdutos ? (
        <ActivityIndicator size="small" color="#4B7BE5" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker selectedValue={produtoSelecionado} onValueChange={(val) => setProdutoSelecionado(val)}>
            {produtos.map(p => <Picker.Item key={p.id} label={p.nome} value={p.id} />)}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>Valor Mínimo (R$)</Text>
      <TextInput style={styles.input} placeholder="Ex: 1500.00" value={valorMinimo} onChangeText={setValorMinimo} keyboardType="numeric" />

      <Text style={styles.label}>Data de Início (ISO Format)</Text>
      <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} />

      <Text style={styles.label}>Data de Término (ISO Format)</Text>
      <TextInput style={styles.input} value={dataFim} onChangeText={setDataFim} />

      <TouchableOpacity style={styles.button} onPress={handleSalvarLeilao}>
        <Text style={styles.buttonText}>Publicar Leilão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F0E6' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, backgroundColor: '#f0f0f0' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#CB9B3C', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  avisoCaixa: { padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1 },
  avisoErro: { backgroundColor: '#FDECEA', borderColor: '#E74C3C' },
  avisoSucesso: { backgroundColor: '#EAF8F1', borderColor: '#2ECC71' },
  avisoLoading: { backgroundColor: '#EBF5FB', borderColor: '#3498DB' },
  avisoTexto: { fontSize: 13, fontWeight: 'bold', color: '#333' },
});

export default CadastroLeilaoScreen;

//marrom #4B2E1E -- dourado #CB9B3C -- creme #F5F0E6