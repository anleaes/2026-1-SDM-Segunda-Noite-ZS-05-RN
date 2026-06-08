import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { API_URL } from '../config';

const DetalheLeilaoScreen = ({ route, navigation }: any) => {
  const { leilaoId, produtoNome, valorAtual } = route.params || {};
  
  const [valorLance, setValorLance] = useState('');
  const [statusAviso, setStatusAviso] = useState({ tipo: '', mensagem: '' });
  
  const [compradores, setCompradores] = useState<any[]>([]);
  const [compradorSelecionado, setCompradorSelecionado] = useState<string | number>('');
  const [loadingCompradores, setLoadingCompradores] = useState(true);

  // Novo estado para controlar o maior lance recebido
  const [maiorLance, setMaiorLance] = useState<number | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // 1. Busca os usuários para o Picker
        const resUsuarios = await fetch(`${API_URL}/usuarios/`);
        if (resUsuarios.ok) {
          const dataUsuarios = await resUsuarios.json();
          setCompradores(dataUsuarios);
          if (dataUsuarios.length > 0) {
            setCompradorSelecionado(dataUsuarios[0].id);
          }
        }

        // 2. Busca os lances para calcular o "Valor Atual"
        const resLances = await fetch(`${API_URL}/lances/`);
        if (resLances.ok) {
          const dataLances = await resLances.json();
          const lancesDesteLeilao = dataLances.filter((lance: any) => lance.leilao === leilaoId);
          
          if (lancesDesteLeilao.length > 0) {
            // Encontra o maior valor entre os lances
            const maxBid = Math.max(...lancesDesteLeilao.map((l: any) => parseFloat(l.valor)));
            setMaiorLance(maxBid);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoadingCompradores(false);
      }
    };

    fetchDados();
  }, [leilaoId]);

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

    const valorNumerico = parseFloat(valorLance.replace(',', '.'));
    const valorReferencia = maiorLance ? maiorLance : parseFloat(valorAtual);

    if (valorNumerico <= valorReferencia) {
      setStatusAviso({ tipo: 'erro', mensagem: `O lance deve ser maior que R$ ${valorReferencia.toFixed(2)}` });
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
          valor: valorNumerico, 
          comprador: compradorSelecionado
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
      
      <View style={styles.valoresContainer}>
        <Text style={styles.valorMinimo}>
          Valor Mínimo: R$ {parseFloat(valorAtual).toFixed(2)}
        </Text>
        
        {maiorLance ? (
          <Text style={styles.valorAtual}>
            Maior Lance Atual: R$ {maiorLance.toFixed(2)}
          </Text>
        ) : (
          <Text style={styles.valorAtual}>
            Valor Atual: R$ {parseFloat(valorAtual).toFixed(2)} (Sem Lances)
          </Text>
        )}
      </View>
      
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

      <Text style={styles.inputLabel}>Valor do Lance</Text>
      <TextInput 
        style={styles.input} 
        placeholder={`Ex: ${(maiorLance ? maiorLance + 10 : parseFloat(valorAtual) + 10).toFixed(2)}`} 
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  
  valoresContainer: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  valorMinimo: { fontSize: 14, color: '#666', marginBottom: 5 },
  valorAtual: { fontSize: 18, color: '#27AE60', fontWeight: 'bold' },
  
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