import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useReminders } from '../context/ReminderContext';
import { ReminderCard } from '../components/ReminderCard';
import { colors } from '../theme/colors';

export function ScheduledRemindersScreen() {
  const {
    lembretes,
    concluirLembrete,
    adiarLembrete,
    cancelarLembreteIndividual,
    cancelarTodosLembretes,
  } = useReminders();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.screenTitle}>Agendados</Text>

        <FlatList
          data={lembretes}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum lembrete agendado no momento.
            </Text>
          }
          renderItem={({ item }) => (
            <ReminderCard
              item={item}
              onConcluir={concluirLembrete}
              onAdiar={adiarLembrete}
              onCancelar={cancelarLembreteIndividual}
            />
          )}
        />

        {lembretes.length > 0 && (
          <Pressable
            style={styles.cancelAllBtn}
            onPress={cancelarTodosLembretes}
          >
            <Text style={styles.cancelAllText}>Cancelar todos</Text>
          </Pressable>
        )}
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
  emptyText: {
    textAlign: 'center',
    color: colors.placeholder,
    marginTop: 40,
    fontSize: 14,
  },
  cancelAllBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelAllText: {
    color: colors.dangerText,
    fontSize: 14,
    fontWeight: '600',
  },
});
