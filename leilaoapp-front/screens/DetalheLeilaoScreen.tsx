import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { API_URL } from '../config';

const DetalheLeilaoScreen = ({ route, navigation }: any) => {
  const { leilaoId, produtoNome, valorAtual } = route.params || {};
  
  const [valorLance, setValorLance] = useState('');
  const [statusAviso, setStatusAviso] = useState({ tipo: '', mensagem: '' });
  
  // Estados para o nosso "Login Improvisado"
  const [compradores, setCompradores] = useState<any[]>([]);
  const [compradorSelecionado, setCompradorSelecionado] = useState<string | number>('');
  const [loadingCompradores, setLoadingCompradores] = useState(true);

  // Busca os usuários na API para montar o Picker
  useEffect(() => {
    const fetchCompradores = async () => {
      try {
        const response = await fetch(`${API_URL}/usuarios/`);
        if (response.ok) {
          const data = await response.json();
          setCompradores(data);
          // Se tiver usuários, já deixa o primeiro selecionado por padrão
          if (data.length > 0) {
            setCompradorSelecionado(data[0].id);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoadingCompradores(false);
      }
    };

    fetchCompradores();
  }, []);

  const extrairErro = async (resposta: Response) => {
    try {
      const json = await resposta.json();
      return JSON.stringify(json, null, 2);
    } catch {
      return await resposta.text();
    }
  };

  const handleDarLance = async () => {
    if (!valorLance) {
      setStatusAviso({ tipo: 'erro', mensagem: 'Por favor, insira um valor para o lance.' });
      return;
    }

    if (!compradorSelecionado) {
      setStatusAviso({ tipo: 'erro', mensagem: 'Nenhum comprador selecionado. Cadastre um usuário primeiro.' });
      return;
    }

    setStatusAviso({ tipo: 'loading', mensagem: 'Processando lance...' });

    try {
      const response = await fetch(`${API_URL}/lances/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          leilao: leilaoId,
          valor: parseFloat(valorLance.replace(',', '.')), 
          comprador: compradorSelecionado // CORRIGIDO: Enviando 'comprador' em vez de 'usuario'
        }),
      });

      if (!response.ok) {
        const erroDetalhado = await extrairErro(response);
        setStatusAviso({ tipo: 'erro', mensagem: `Lance recusado pelo servidor:\n${erroDetalhado}` });
        return;
      }

      setStatusAviso({ tipo: 'sucesso', mensagem: 'Lance registrado com sucesso!' });
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      setStatusAviso({ tipo: 'erro', mensagem: `Falha na conexão:\n${error.message}` });
    }
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>{produtoNome}</Text>
      <Text style={styles.valor}>Valor Mínimo/Atual: R$ {String(valorAtual)}</Text>
      
      {/* --- INÍCIO DO LOGIN IMPROVISADO --- */}
      <Text style={styles.inputLabel}>Quem está dando o lance? (Login)</Text>
      {loadingCompradores ? (
        <ActivityIndicator size="small" color="#E67E22" style={{ marginBottom: 15 }} />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={compradorSelecionado}
            onValueChange={(itemValue) => setCompradorSelecionado(itemValue)}
          >
            {compradores.map((comp) => (
              <Picker.Item 
                key={comp.id} 
                label={`ID: ${comp.id} - ${comp.pessoa_nome || comp.cpf || 'Usuário Sem Nome'}`} 
                value={comp.id} 
              />
            ))}
          </Picker>
        </View>
      )}
      {/* --- FIM DO LOGIN IMPROVISADO --- */}

      <Text style={styles.inputLabel}>Valor do Lance</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: 2500.50" 
        value={valorLance} 
        onChangeText={setValorLance} 
        keyboardType="decimal-pad" 
      />

      <TouchableOpacity style={styles.button} onPress={handleDarLance}>
        <Text style={styles.buttonText}>Confirmar Lance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  valor: { fontSize: 18, color: '#27AE60', marginBottom: 20 },
  
  inputLabel: { fontSize: 14, color: '#555', marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20, backgroundColor: '#fafafa' },
  
  button: { backgroundColor: '#E67E22', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  avisoCaixa: { padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1 },
  avisoErro: { backgroundColor: '#FDECEA', borderColor: '#E74C3C' },
  avisoSucesso: { backgroundColor: '#EAF8F1', borderColor: '#2ECC71' },
  avisoLoading: { backgroundColor: '#EBF5FB', borderColor: '#3498DB' },
  avisoTexto: { fontSize: 14, fontWeight: 'bold', color: '#333' },
});

export default DetalheLeilaoScreen;