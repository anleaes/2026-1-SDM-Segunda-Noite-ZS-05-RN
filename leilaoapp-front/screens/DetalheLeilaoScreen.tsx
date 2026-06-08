import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

const DetalheLeilaoScreen = ({ route, navigation }: any) => {
  const { leilaoId, produtoNome, valorAtual } = route.params || {};
  const [valorLance, setValorLance] = useState('');

  const handleDarLance = async () => {
    try {
      const response = await fetch(`${API_URL}/lances/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leilao: leilaoId,
          valor: parseFloat(valorLance),
          usuario: 1 // Por enquanto fixo, depois trocamos pelo usuário logado
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Lance registrado!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Lance inválido ou muito baixo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{produtoNome}</Text>
      <Text style={styles.valor}>Valor Atual: R$ {String(valorAtual)}</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Seu lance" 
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
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#E67E22', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default DetalheLeilaoScreen;