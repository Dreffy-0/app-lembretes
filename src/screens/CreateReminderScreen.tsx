import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Recorrencia, RootTabParamList } from '../types/reminder';
import { useReminders } from '../context/ReminderContext';
import { RecurrenceSelector } from '../components/RecurrenceSelector';
import { colors } from '../theme/colors';

type Props = BottomTabScreenProps<RootTabParamList, 'Cadastro'>;

export function CreateReminderScreen({ navigation }: Props) {
  const { adicionarLembrete, dispararTesteEm5Segundos } = useReminders();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [recorrencia, setRecorrencia] = useState<Recorrencia>('diaria');
  const [horario, setHorario] = useState('08:00');

  async function handleSave() {
    const sucesso = await adicionarLembrete({
      titulo,
      descricao,
      horario,
      recorrencia,
    });

    if (sucesso) {
      setTitulo('');
      setDescricao('');
      navigation.navigate('Agendados');
    }
  }

  async function handleQuickTest() {
    await dispararTesteEm5Segundos(titulo, descricao);
    navigation.navigate('Agendados');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.screenTitle}>Novo lembrete</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Beber água"
          placeholderTextColor={colors.placeholder}
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Um copo de 300 ml"
          placeholderTextColor={colors.placeholder}
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Repetição</Text>
        <RecurrenceSelector value={recorrencia} onChange={setRecorrencia} />

        <Text style={styles.label}>Horário</Text>
        <TextInput
          style={styles.input}
          placeholder="08:00"
          placeholderTextColor={colors.placeholder}
          value={horario}
          onChangeText={setHorario}
          keyboardType="numbers-and-punctuation"
        />

        <View style={styles.bottomActions}>
          <Pressable style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonText}>Agendar lembrete</Text>
          </Pressable>

          <Pressable style={styles.testButton} onPress={handleQuickTest}>
            <Text style={styles.testButtonText}>
              Testar notificação rápida (5 segundos)
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 18,
    backgroundColor: colors.background,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  screenTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  bottomActions: {
    marginTop: 'auto',
    gap: 10,
  },
  primaryButton: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  testButton: {
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.indigoBg,
  },
  testButtonText: {
    color: colors.indigoText,
    fontSize: 13,
    fontWeight: '600',
  },
});
