"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { router } from "expo-router"

export default function Home() {
  const [valorImovel, setValorImovel] = useState("")
  const [entrada, setEntrada] = useState("")
  const [prazo, setPrazo] = useState("")
  const [juros, setJuros] = useState("")

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, "")
    const formattedValue = (numericValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    return formattedValue
  }

  const handleValorImovelChange = (text) => {
    const formatted = formatCurrency(text)
    setValorImovel(formatted)
  }

  const handleEntradaChange = (text) => {
    const formatted = formatCurrency(text)
    setEntrada(formatted)
  }

  const parseValue = (value) => {
    return Number.parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0
  }

  const handleSimular = () => {
    const valorImovelNum = parseValue(valorImovel)
    const entradaNum = parseValue(entrada)
    const prazoNum = Number.parseInt(prazo) || 0
    const jurosNum = Number.parseFloat(juros.replace(",", ".")) || 0

    if (!valorImovelNum || !prazoNum || !jurosNum) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios")
      return
    }

    if (entradaNum >= valorImovelNum) {
      Alert.alert("Erro", "O valor da entrada deve ser menor que o valor do imóvel")
      return
    }

    const valorFinanciado = valorImovelNum - entradaNum

    router.push({
      pathname: "/results",
      params: {
        valorImovel: valorImovelNum,
        entrada: entradaNum,
        valorFinanciado,
        prazo: prazoNum,
        juros: jurosNum,
      },
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Simulador de Financiamento</Text>
          <Text style={styles.subtitle}>Sistema SAC - Parcelas Decrescentes</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor do Imóvel *</Text>
            <TextInput
              style={styles.input}
              value={valorImovel}
              onChangeText={handleValorImovelChange}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor da Entrada</Text>
            <TextInput
              style={styles.input}
              value={entrada}
              onChangeText={handleEntradaChange}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prazo (meses) *</Text>
            <TextInput
              style={styles.input}
              value={prazo}
              onChangeText={setPrazo}
              placeholder="360"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Taxa de Juros (% ao mês) *</Text>
            <TextInput
              style={styles.input}
              value={juros}
              onChangeText={setJuros}
              placeholder="0,75"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSimular}>
            <Text style={styles.buttonText}>Simular Financiamento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
})
