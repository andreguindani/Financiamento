import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

function calcularSAC({ principal, months, annualRate }) {
  const amortizacaoConst = principal / months;
  const r = annualRate / 100 / 12;
  let saldo = principal;
  const rows = [];

  for (let m = 1; m <= months; m++) {
    const juros = saldo * r;
    let prestacao = amortizacaoConst + juros;

    if (m === months) {
      prestacao = saldo + juros;
      saldo = 0;
    } else {
      saldo -= amortizacaoConst;
    }

    rows.push({ mes: m, amortizacao: amortizacaoConst, juros, prestacao, saldo });
  }

  return rows;
}

export default function Sac() {
  const params = useLocalSearchParams();
  const valorImovel = Number(params.valorImovel) || 0;
  const entrada = Number(params.entrada) || 0;
  const prazoAnos = Number(params.prazoAnos) || 30;
  const taxaAnual = Number(params.taxaAnual) || 1;
  const principal = Math.max(0, valorImovel - entrada);
  const months = Math.max(1, Math.trunc(prazoAnos * 12));

  const rows = calcularSAC({ principal, months, annualRate: taxaAnual });

  const formatBRL = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <ScrollView style={styles.container}>
      {rows.map((r, index) => (
        <View key={r.mes} style={[styles.card, { backgroundColor: index % 2 === 0 ? '#fefefe' : '#f7f9fc' }]}>
          <View style={styles.row}>
            <Text style={styles.label}>Mês:</Text>
            <Text style={styles.value}>{r.mes}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amortização:</Text>
            <Text style={styles.value}>{formatBRL(r.amortizacao)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Juros:</Text>
            <Text style={styles.value}>{formatBRL(r.juros)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Prestação:</Text>
            <Text style={styles.value}>{formatBRL(r.prestacao)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Saldo:</Text>
            <Text style={[styles.value, styles.saldo]}>{formatBRL(r.saldo)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#e5e9f0' },
  card: {
    borderRadius: 12,
    padding: 10,          // menor padding
    marginBottom: 6,      // menor margem entre cartões
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }, // menor espaçamento
  label: { fontWeight: '600', color: '#555', fontSize: 12 }, // fonte menor
  value: { fontWeight: '500', color: '#222', fontSize: 12 },
  saldo: { color: '#3b3b98', fontWeight: '700' },
});
