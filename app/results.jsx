"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useLocalSearchParams, router } from "expo-router"

export default function Results() {
  const params = useLocalSearchParams()
  const [tabelaSAC, setTabelaSAC] = useState([])
  const [resumo, setResumo] = useState({})

  useEffect(() => {
    calcularSAC()
  }, [])

  const calcularSAC = () => {
    const valorFinanciado = Number.parseFloat(params.valorFinanciado)
    const prazo = Number.parseInt(params.prazo)
    const taxaJuros = Number.parseFloat(params.juros) / 100

    const amortizacao = valorFinanciado / prazo
    let saldoDevedor = valorFinanciado
    const tabela = []
    let totalJuros = 0

    for (let i = 1; i <= prazo; i++) {
      const juros = saldoDevedor * taxaJuros
      const prestacao = amortizacao + juros

      tabela.push({
        parcela: i,
        prestacao: prestacao,
        juros: juros,
        amortizacao: amortizacao,
        saldoDevedor: saldoDevedor - amortizacao,
      })

      totalJuros += juros
      saldoDevedor -= amortizacao
    }

    setTabelaSAC(tabela)
    setResumo({
      valorFinanciado,
      totalJuros,
      totalPago: valorFinanciado + totalJuros,
      primeiraParcela: tabela[0]?.prestacao || 0,
      ultimaParcela: tabela[tabela.length - 1]?.prestacao || 0,
    })
  }

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const renderParcela = ({ item }) => (
    <View style={styles.parcelaRow}>
      <Text style={styles.parcelaNumber}>{item.parcela}</Text>
      <Text style={styles.parcelaValue}>{formatCurrency(item.prestacao)}</Text>
      <Text style={styles.parcelaJuros}>{formatCurrency(item.juros)}</Text>
      <Text style={styles.parcelaAmort}>{formatCurrency(item.amortizacao)}</Text>
    </View>
  )

  const navegarParaSAC = () => {
    const searchParams = new URLSearchParams({
      valorFinanciado: params.valorFinanciado?.toString() || "",
      prazo: params.prazo?.toString() || "",
      juros: params.juros?.toString() || "",
    })

    router.push(`/sac?${searchParams.toString()}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resultados da Simulação</Text>
        <Text style={styles.subtitle}>Sistema SAC</Text>
      </View>

      <View style={styles.resumoCard}>
        <Text style={styles.cardTitle}>Resumo do Financiamento</Text>

        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Valor Financiado:</Text>
          <Text style={styles.resumoValue}>{formatCurrency(resumo.valorFinanciado || 0)}</Text>
        </View>

        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Total de Juros:</Text>
          <Text style={[styles.resumoValue, styles.jurosText]}>{formatCurrency(resumo.totalJuros || 0)}</Text>
        </View>

        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Total a Pagar:</Text>
          <Text style={[styles.resumoValue, styles.totalText]}>{formatCurrency(resumo.totalPago || 0)}</Text>
        </View>

        <View style={styles.parcelasInfo}>
          <View style={styles.parcelaInfo}>
            <Text style={styles.parcelaInfoLabel}>1ª Parcela</Text>
            <Text style={styles.parcelaInfoValue}>{formatCurrency(resumo.primeiraParcela || 0)}</Text>
          </View>
          <View style={styles.parcelaInfo}>
            <Text style={styles.parcelaInfoLabel}>Última Parcela</Text>
            <Text style={styles.parcelaInfoValue}>{formatCurrency(resumo.ultimaParcela || 0)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.tabelaButton} onPress={navegarParaSAC}>
        <Text style={styles.tabelaButtonText}>Ver Tabela Completa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.novaSimulacaoButton} onPress={() => router.push("/")}>
        <Text style={styles.novaSimulacaoButtonText}>Nova Simulação</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  resumoCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  resumoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  resumoLabel: {
    fontSize: 16,
    color: "#64748b",
  },
  resumoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  jurosText: {
    color: "#ef4444",
  },
  totalText: {
    color: "#3b82f6",
    fontSize: 18,
  },
  parcelasInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  parcelaInfo: {
    alignItems: "center",
    flex: 1,
  },
  parcelaInfoLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  parcelaInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  tabelaButton: {
    backgroundColor: "#3b82f6",
    margin: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  tabelaButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  novaSimulacaoButton: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  novaSimulacaoButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
})
