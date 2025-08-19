"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useLocalSearchParams, router } from "expo-router"

export default function SAC() {
  const params = useLocalSearchParams()
  const [tabelaSAC, setTabelaSAC] = useState([])

  const valorFinanciado = Array.isArray(params.valorFinanciado) ? params.valorFinanciado[0] : params.valorFinanciado
  const prazo = Array.isArray(params.prazo) ? params.prazo[0] : params.prazo
  const juros = Array.isArray(params.juros) ? params.juros[0] : params.juros

  useEffect(() => {
    if (valorFinanciado && prazo && juros) {
      calcularTabelaSAC()
    }
  }, [valorFinanciado, prazo, juros])

  const calcularTabelaSAC = () => {
    try {
      const valor = Number.parseFloat(valorFinanciado)
      const nParcelas = Number.parseInt(prazo)
      const taxa = Number.parseFloat(juros) / 100

      if (!valor || !nParcelas || !taxa) return

      const amortizacao = valor / nParcelas
      let saldo = valor
      const tabela = []

      for (let i = 1; i <= nParcelas; i++) {
        const jurosParcela = saldo * taxa
        const prestacao = amortizacao + jurosParcela
        saldo -= amortizacao

        tabela.push({
          parcela: i,
          prestacao,
          juros: jurosParcela,
          amortizacao,
          saldoDevedor: Math.max(0, saldo),
        })
      }

      setTabelaSAC(tabela)
    } catch (error) {
      console.error("Erro no cálculo SAC:", error)
    }
  }

  const formatCurrency = (value) => value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "R$ 0,00"

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, styles.colNum]}>Nº</Text>
      <Text style={[styles.headerText, styles.col]}>Prestação</Text>
      <Text style={[styles.headerText, styles.col]}>Juros</Text>
      <Text style={[styles.headerText, styles.col]}>Amortização</Text>
      <Text style={[styles.headerText, styles.col]}>Saldo</Text>
    </View>
  )

  const renderParcela = ({ item, index }) => (
    <View style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <Text style={styles.cellNum}>{item.parcela}</Text>
      <Text style={styles.cell}>{formatCurrency(item.prestacao)}</Text>
      <Text style={styles.cell}>{formatCurrency(item.juros)}</Text>
      <Text style={styles.cell}>{formatCurrency(item.amortizacao)}</Text>
      <Text style={styles.cell}>{formatCurrency(item.saldoDevedor)}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabela SAC</Text>
        <Text style={styles.subtitle}>Sistema de Amortização Constante</Text>
        {tabelaSAC.length > 0 && <Text style={styles.info}>{tabelaSAC.length} parcelas calculadas</Text>}
      </View>

      <View style={styles.card}>
        {tabelaSAC.length > 0 ? (
          <FlatList
            data={tabelaSAC}
            renderItem={renderParcela}
            keyExtractor={(item) => item.parcela.toString()}
            ListHeaderComponent={renderHeader}
          />
        ) : (
          <Text style={styles.noData}>Nenhum dado para exibir</Text>
        )}
      </View>

      <TouchableOpacity style={styles.voltarButton} onPress={() => router.back()}>
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 6,
    fontWeight: "500",
  },

  info: {
    fontSize: 14,
    color: "#059669",
    marginTop: 8,
    fontWeight: "600",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1d4ed8",
  },

  headerText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  rowEven: {
    backgroundColor: "#f8fafc",
  },

  rowOdd: {
    backgroundColor: "#ffffff",
  },

  colNum: { flex: 0.6 }, // increased from 0.4 to 0.6 to prevent number wrapping
  col: { flex: 1.4 }, // reduced from 1.5 to 1.4 to compensate for wider number column

  cellNum: {
    flex: 0.6, // increased from 0.4 to 0.6 to match header
    fontSize: 14,
    textAlign: "center",
    color: "#1e293b",
    fontWeight: "600",
  },

  cell: {
    flex: 1.4, // reduced from 1.5 to 1.4 to match header
    fontSize: 11,
    textAlign: "right",
    color: "#374151",
    paddingHorizontal: 1,
    fontWeight: "500",
    flexWrap: "nowrap",
  },

  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#64748b",
    fontWeight: "500",
  },

  voltarButton: {
    backgroundColor: "#3b82f6",
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  voltarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
})
