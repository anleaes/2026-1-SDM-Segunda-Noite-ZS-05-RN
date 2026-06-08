import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

const CadastroPessoaScreen = ({ navigation }: any) => {
  // Estados de Pessoa (Estritamente os campos do Model Pessoa)
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');

  // Estados de Usuario (CPF pertence exclusivamente aqui)
  const [cpf, setCpf] = useState('');
  const [perfil, setPerfil] = useState('comprador');
  const [ativo, setAtivo] = useState(true);

  // Estados de Endereço (Estritamente os campos do Model Endereco)
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [principal, setPrincipal] = useState(false);

  // Controle de mensagens de UI
  const [statusAviso, setStatusAviso] = useState({ tipo: '', mensagem: '' });

  const extrairErro = async (resposta: Response) => {
    try {
      const json = await resposta.json();
      return JSON.stringify(json, null, 2);
    } catch {
      return await resposta.text();
    }
  };

  const handleSalvar = async () => {
    setStatusAviso({ tipo: 'loading', mensagem: 'Processando cadastro...' });

    try {
      // 1. Salvar a Pessoa (Sem o CPF!)
      const resPessoa = await fetch(`${API_URL}/pessoas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nome, sobrenome, email }),
      });

      if (!resPessoa.ok) {
        const erroDetalhado = await extrairErro(resPessoa);
        setStatusAviso({ tipo: 'erro', mensagem: `Recusado em Pessoa:\n${erroDetalhado}` });
        return;
      }

      const pessoaCriada = await resPessoa.json();
      const pessoaId = pessoaCriada.id;

      // 2. Salvar o Usuário vinculado à Pessoa
      const resUsuario = await fetch(`${API_URL}/usuarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          perfil, 
          ativo, 
          pontuacao: 0, 
          cpf, // CPF é enviado apenas aqui
          pessoa: pessoaId 
        }),
      });

      if (!resUsuario.ok) {
        const erroDetalhado = await extrairErro(resUsuario);
        setStatusAviso({ tipo: 'erro', mensagem: `Recusado em Usuário:\n${erroDetalhado}` });
        return;
      }

      const usuarioCriado = await resUsuario.json();
      const usuarioId = usuarioCriado.id;

      // 3. Salvar o Endereço vinculado ao Usuário
      const resEndereco = await fetch(`${API_URL}/enderecos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          cep, 
          numero, 
          complemento, 
          principal, 
          usuario: usuarioId 
        }),
      });

      if (!resEndereco.ok) {
        const erroDetalhado = await extrairErro(resEndereco);
        setStatusAviso({ tipo: 'erro', mensagem: `Recusado em Endereço:\n${erroDetalhado}` });
        return;
      }

      // SUCESSO!
      setStatusAviso({ tipo: 'sucesso', mensagem: 'Cadastro concluído com sucesso!' });
      
      setTimeout(() => {
        navigation.navigate('Pessoas');
      }, 1500);
      
    } catch (error: any) {
      setStatusAviso({ tipo: 'erro', mensagem: `Erro Crítico: O servidor não respondeu ou a internet caiu.\nDetalhe: ${error.message}` });
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      
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

      <Text style={styles.sectionTitle}>Dados Pessoais</Text>
      
      <Text style={styles.inputLabel}>Nome</Text>
      <TextInput style={styles.input} placeholder="Ex: João" value={nome} onChangeText={setNome} />

      <Text style={styles.inputLabel}>Sobrenome</Text>
      <TextInput style={styles.input} placeholder="Ex: da Silva" value={sobrenome} onChangeText={setSobrenome} />
      
      <Text style={styles.inputLabel}>E-mail</Text>
      <TextInput style={styles.input} placeholder="Ex: joao@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      

      <Text style={styles.sectionTitle}>Configuração de Usuário</Text>

      <Text style={styles.inputLabel}>CPF</Text>
      <TextInput style={styles.input} placeholder="Ex: 123.456.789-00" value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={14} />
      
      <Text style={styles.inputLabel}>Selecione o Perfil do Usuário:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={perfil} onValueChange={(itemValue) => setPerfil(itemValue)}>
          <Picker.Item label="Comprador" value="comprador" />
          <Picker.Item label="Vendedor" value="vendedor" />
          <Picker.Item label="Administrador" value="admin" />
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.inputLabel}>Usuário Ativo?</Text>
        <Switch value={ativo} onValueChange={setAtivo} />
      </View>

      <Text style={styles.sectionTitle}>Endereço do Usuário</Text>
      
      <Text style={styles.inputLabel}>CEP</Text>
      <TextInput style={styles.input} placeholder="Ex: 90000-000" value={cep} onChangeText={setCep} keyboardType="numeric" maxLength={10} />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.inputLabel}>Número</Text>
          <TextInput style={styles.input} placeholder="Ex: 123" value={numero} onChangeText={setNumero} keyboardType="numeric" />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.inputLabel}>Complemento</Text>
          <TextInput style={styles.input} placeholder="Ex: Apto 4" value={complemento} onChangeText={setComplemento} />
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.inputLabel}>Endereço Principal?</Text>
        <Switch value={principal} onValueChange={setPrincipal} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Finalizar Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  
  avisoCaixa: { padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1 },
  avisoErro: { backgroundColor: '#FDECEA', borderColor: '#E74C3C' },
  avisoSucesso: { backgroundColor: '#EAF8F1', borderColor: '#2ECC71' },
  avisoLoading: { backgroundColor: '#EBF5FB', borderColor: '#3498DB' },
  avisoTexto: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 5, marginBottom: 10, color: '#4B7BE5', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  inputLabel: { fontSize: 13, color: '#555', marginBottom: 4, fontWeight: '600', marginLeft: 2 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa', fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingVertical: 5, paddingHorizontal: 5 },
  button: { backgroundColor: '#4B7BE5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 50, elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CadastroPessoaScreen;