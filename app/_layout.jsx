import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Simulador de Financiamento' }} />
      <Stack.Screen name="results" options={{ title: 'Resultados' }} />
      <Stack.Screen name="sac" options={{ title: 'Tabela SAC' }} />
    </Stack>
  );
}