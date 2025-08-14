import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const [valorImovel, setValorImovel] = useState('');
  const [entrada, setEntrada] = useState('');
  const [prazoAnos, setPrazoAnos] = useState('');
  const [taxaAnual, setTaxaAnual] = useState('');

  function toNumber(v) {
    const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function calcular() {
    router.push({
      pathname: '/results',
      params: {
        valorImovel: toNumber(valorImovel),
        entrada: toNumber(entrada),
        prazoAnos: prazoAnos,
        taxaAnual: taxaAnual,
      },
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>🏠 Simulador de Financiamento</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Valor do imóvel (R$)</Text>
        <TextInput
          value={valorImovel}
          onChangeText={setValorImovel}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Entrada (R$)</Text>
        <TextInput
          value={entrada}
          onChangeText={setEntrada}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Prazo (anos)</Text>
        <TextInput
          value={prazoAnos}
          onChangeText={setPrazoAnos}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Taxa anual (%)</Text>
        <TextInput
          value={taxaAnual}
          onChangeText={setTaxaAnual}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calcular}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3b3b98',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // para Android
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f1f2f6',
  },
  button: {
    backgroundColor: '#3b3b98',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
