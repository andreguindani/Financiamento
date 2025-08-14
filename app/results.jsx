import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

function calcularParcelasConstantRate({ principal, months, annualRate }) {
  const r = annualRate / 100 / 12;
  if (r === 0) return { monthly: principal / months, total: principal };
  const pow = Math.pow(1 + r, months);
  const monthly = (principal * r * pow) / (pow - 1);
  const total = monthly * months;
  return { monthly, total };
}

function calcularSAC({ principal, months, annualRate }) {
  const amortizacaoConst = principal / months;
  const r = annualRate / 100 / 12;
  let saldo = principal;
  const rows = [];
  for (let m = 1; m <= months; m++) {
    const juros = saldo * r;
    const prestacao = amortizacaoConst + juros;
    saldo = Math.max(0, saldo - amortizacaoConst);
    rows.push({ mes: m, amortizacao: amortizacaoConst, juros, prestacao, saldo });
  }
  return rows;
}

export default function Results() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const valorImovel = Number(params.valorImovel) || 0;
  const entrada = Number(params.entrada) || 0;
  const prazoAnos = Number(params.prazoAnos) || 30;
  const taxaAnual = Number(params.taxaAnual) || 1;

  const principal = Math.max(0, valorImovel - entrada);
  const months = Math.max(1, Math.trunc(prazoAnos * 12));

  const priceResult = calcularParcelasConstantRate({ principal, months, annualRate: taxaAnual });
  const sacRows = calcularSAC({ principal, months, annualRate: taxaAnual });

  const comp20 = calcularParcelasConstantRate({ principal, months: 20 * 12, annualRate: taxaAnual });
  const comp30 = calcularParcelasConstantRate({ principal, months: 30 * 12, annualRate: taxaAnual });

  const chartData = useMemo(() => {
    const labels = [];
    const data = [];
    const step = Math.max(1, Math.floor(months / 12));
    for (let i = 0; i < months; i += step) {
      const row = sacRows[i];
      if (row) {
        labels.push(String(Math.ceil((i + 1) / 12) + 'y'));
        data.push(Number(row.prestacao.toFixed(2)));
      }
    }
    return { labels, data };
  }, [sacRows]);

  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>Resultados</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Valor financiado:</Text>
        <Text style={styles.value}>R$ {principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <Text style={styles.label}>Prazo:</Text>
        <Text style={styles.value}>{prazoAnos} anos ({months} meses)</Text>
        <Text style={styles.label}>Taxa anual:</Text>
        <Text style={styles.value}>{taxaAnual}% a.a.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Parcelas (SAC)</Text>
        <Text style={styles.label}>Primeira parcela: R$ {sacRows[0]?.prestacao.toFixed(2)}</Text>
        <Text style={styles.label}>Última parcela: R$ {sacRows[sacRows.length - 1]?.prestacao.toFixed(2)}</Text>
        <Text style={styles.label}>Total pago: R$ {sacRows.reduce((s, r) => s + r.prestacao, 0).toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Comparação (Price)</Text>
        <Text style={styles.label}>20 anos: R$ {comp20.monthly.toFixed(2)} — Total: R$ {comp20.total.toFixed(2)}</Text>
        <Text style={styles.label}>30 anos: R$ {comp30.monthly.toFixed(2)} — Total: R$ {comp30.total.toFixed(2)}</Text>
      </View>

      <View style={{ marginVertical: 20 }}>
        <Text style={[styles.cardTitle, { marginBottom: 10 }]}>Gráfico de amortização (SAC)</Text>
        <LineChart
          data={{ labels: chartData.labels, datasets: [{ data: chartData.data }] }}
          width={screenWidth}
          height={220}
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#eef2ff',
            backgroundGradientTo: '#c7d2fe',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(59, 59, 152, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={{ borderRadius: 16 }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: '/sac', params: { valorImovel, entrada, prazoAnos, taxaAnual } })}
        >
          <Text style={styles.buttonText}>Ver Tabela SAC</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#999' }]} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#3b3b98', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#3b3b98' },
  label: { fontSize: 16, color: '#333', marginBottom: 5 },
  value: { fontSize: 16, fontWeight: '500', marginBottom: 10 },
  button: {
    backgroundColor: '#3b3b98',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
