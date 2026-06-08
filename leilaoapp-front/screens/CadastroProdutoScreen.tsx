import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config';

const CadastroProdutoScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorInicial, setValorInicial] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [vendedorId, setVendedorId] = useState(''); // ID do Usuario Vendedor
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/categorias/`);
        const data = await response.json();
        setCategorias(data);
        if (data.length > 0) setCategoriaId(data[0].id.toString());
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSalvar = async () => {
    try {
      const response = await fetch(`${API_URL}/produtos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          valor_inicial: parseFloat(valorInicial),
          categoria: parseInt(categoriaId),
          vendedor: parseInt(vendedorId) // Associa ao vendedor (Usuario)
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto cadastrado!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Falha ao salvar produto.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão.');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Produto</Text>
      
      <TextInput style={styles.input} placeholder="Nome do Produto" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <TextInput style={styles.input} placeholder="Valor Inicial (Ex: 100.00)" value={valorInicial} onChangeText={setValorInicial} keyboardType="decimal-pad" />
      
      <Text style={styles.label}>Categoria:</Text>
      <View style={styles.picker}>
        <Picker selectedValue={categoriaId} onValueChange={(val) => setCategoriaId(val)}>
          {categorias.map(c => <Picker.Item key={c.id} label={c.nome} value={c.id.toString()} />)}
        </Picker>
      </View>

      <TextInput style={styles.input} placeholder="ID do Usuário Vendedor" value={vendedorId} onChangeText={setVendedorId} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: '#555' },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#4B7BE5', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CadastroProdutoScreen;