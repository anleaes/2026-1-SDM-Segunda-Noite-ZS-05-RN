import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

const CadastroProdutoScreen = ({ navigation }: any) => {
  // Estados do Produto
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorInicial, setValorInicial] = useState('');

  // Estados da Categoria Existente
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  
  // Estados para a Nova Categoria
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [novaCategoriaDescricao, setNovaCategoriaDescricao] = useState('');
  const [novaCategoriaCodigo, setNovaCategoriaCodigo] = useState('1');

  // Estados do Vendedor (Usuários)
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [vendedorId, setVendedorId] = useState('');

  const [loading, setLoading] = useState(true);
  const [statusAviso, setStatusAviso] = useState({ tipo: '', mensagem: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca Categorias
        const resCategorias = await fetch(`${API_URL}/categorias/`);
        const dataCategorias = await resCategorias.json();
        setCategorias(dataCategorias);
        if (dataCategorias.length > 0) setCategoriaId(dataCategorias[0].id.toString());

        // 2. Busca Usuários para seleção de Vendedor
        const resVendedores = await fetch(`${API_URL}/usuarios/`);
        const dataVendedores = await resVendedores.json();
        setVendedores(dataVendedores);
        if (dataVendedores.length > 0) setVendedorId(dataVendedores[0].id.toString());

      } catch (error) {
        setStatusAviso({ tipo: 'erro', mensagem: 'Não foi possível carregar os dados iniciais do servidor.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const extrairErro = async (resposta: Response) => {
    try {
      const json = await resposta.json();
      return JSON.stringify(json, null, 2);
    } catch {
      return await resposta.text();
    }
  };

  const handleSalvar = async () => {
    if (!nome || !valorInicial || !vendedorId) {
      setStatusAviso({ tipo: 'erro', mensagem: 'Preencha o nome, valor inicial e selecione um vendedor.' });
      return;
    }

    if (!criandoCategoria && !categoriaId) {
      setStatusAviso({ tipo: 'erro', mensagem: 'Selecione uma categoria para o produto.' });
      return;
    }

    setStatusAviso({ tipo: 'loading', mensagem: 'Processando cadastro...' });

    let categoriaFinalId = categoriaId;

    try {
      // 1. Cria nova categoria se o Switch estiver ativo
      if (criandoCategoria) {
        if (!novaCategoriaNome || !novaCategoriaDescricao) {
          setStatusAviso({ tipo: 'erro', mensagem: 'Preencha o nome e a descrição da nova categoria.' });
          return;
        }

        const resCategoria = await fetch(`${API_URL}/categorias/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ 
            nome: novaCategoriaNome,
            descricao: novaCategoriaDescricao,
            codigo_setor: parseInt(novaCategoriaCodigo) || 1,
            destaque: false
          }),
        });

        if (!resCategoria.ok) {
          const erroDetalhado = await extrairErro(resCategoria);
          setStatusAviso({ tipo: 'erro', mensagem: `Erro ao criar categoria:\n${erroDetalhado}` });
          return;
        }

        const novaCategoriaCriada = await resCategoria.json();
        categoriaFinalId = novaCategoriaCriada.id.toString();
      }

      // 2. Cria o Produto associando as FKs de Categoria e Vendedor
      const responseProduto = await fetch(`${API_URL}/produtos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          valor_inicial: parseFloat(valorInicial.replace(',', '.')),
          categoria: parseInt(categoriaFinalId),
          vendedor: parseInt(vendedorId)
        }),
      });

      if (!responseProduto.ok) {
        const erroDetalhado = await extrairErro(responseProduto);
        setStatusAviso({ tipo: 'erro', mensagem: `Erro ao salvar produto:\n${erroDetalhado}` });
        return;
      }

      // FIX: Corrigido de 'message' para 'mensagem' para exibir na tela corretamente
      setStatusAviso({ tipo: 'sucesso', mensagem: 'Produto cadastrado com sucesso!' });
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      setStatusAviso({ tipo: 'erro', mensagem: `Falha na conexão: ${error.message}` });
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4B2E1E" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <ScrollView style={styles.container}>
      {statusAviso.tipo !== '' && (
        <View style={[
          styles.avisoCaixa, 
          statusAviso.tipo === 'erro' ? styles.avisoErro : 
          statusAviso.tipo === 'sucesso' ? styles.avisoSucesso : 
          styles.avisoLoading
        ]}>
          <Text style={styles.avisoTexto}>{statusAviso.mensagem}</Text>
        </View>
      )}

      <Text style={styles.title}>Novo Produto</Text>
      
      <Text style={styles.label}>Dados do Produto</Text>
      <TextInput style={styles.input} placeholder="Nome do Produto" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Descrição do Produto" value={descricao} onChangeText={setDescricao} multiline />
      <TextInput style={styles.input} placeholder="Valor Inicial (Ex: 150.00)" value={valorInicial} onChangeText={setValorInicial} keyboardType="decimal-pad" />
      
      <View style={styles.separator} />

      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>Criar uma nova Categoria?</Text>
        <Switch value={criandoCategoria} onValueChange={setCriandoCategoria} />
      </View>

      {criandoCategoria ? (
        <View style={styles.nestedContainer}>
          <Text style={styles.label}>Nome da Nova Categoria</Text>
          <TextInput style={styles.input} placeholder="Ex: Informática" value={novaCategoriaNome} onChangeText={setNovaCategoriaNome} />
          
          <Text style={styles.label}>Descrição da Nova Categoria</Text>
          <TextInput style={styles.input} placeholder="Ex: Computadores, mouses e peças" value={novaCategoriaDescricao} onChangeText={setNovaCategoriaDescricao} multiline />
          
          <Text style={styles.label}>Código do Setor</Text>
          <TextInput style={styles.input} placeholder="Ex: 10" value={novaCategoriaCodigo} onChangeText={setNovaCategoriaCodigo} keyboardType="numeric" />
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Selecione a Categoria</Text>
          <View style={styles.picker}>
            <Picker selectedValue={categoriaId} onValueChange={(val) => setCategoriaId(val)}>
              {categorias.map(c => <Picker.Item key={c.id} label={c.nome} value={c.id.toString()} />)}
            </Picker>
          </View>
        </View>
      )}

      <View style={styles.separator} />

      <Text style={styles.label}>Selecione o Usuário Vendedor</Text>
      <View style={styles.picker}>
        <Picker selectedValue={vendedorId} onValueChange={(val) => setVendedorId(val)}>
          {vendedores.map(v => (
            <Picker.Item 
              key={v.id} 
              label={`ID: ${v.id} - ${v.pessoa_nome || v.cpf || 'Usuário'}`} 
              value={v.id.toString()} 
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F0E6' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '##ddd', padding: 15, borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa' },
  label: { fontSize: 14, marginBottom: 5, color: '#555', fontWeight: 'bold' },
  labelSwitch: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#F5F0E6', padding: 10, borderRadius: 8 },
  nestedContainer: { backgroundColor: '#F5F0E6', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  button: { backgroundColor: '#4B2E1E', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  avisoCaixa: { padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1 },
  avisoErro: { backgroundColor: '#FDECEA', borderColor: '#E74C3C' },
  avisoSucesso: { backgroundColor: '#EAF8F1', borderColor: '#2ECC71' },
  avisoLoading: { backgroundColor: '#EBF5FB', borderColor: '#3498DB' },
  avisoTexto: { fontSize: 14, fontWeight: 'bold', color: '#333' },
});
  
export default CadastroProdutoScreen;

//marrom #4B2E1E -- dourado #CB9B3C -- creme #F5F0E6