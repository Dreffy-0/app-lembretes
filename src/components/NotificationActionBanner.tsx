import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Lembrete } from '../types/reminder';
import { colors } from '../theme/colors';

interface NotificationActionBannerProps {
  lembrete: Lembrete | null;
  onConcluir: (notificationId: string) => void;
  onAdiar: (titulo: string, descricao: string) => void;
}

export function NotificationActionBanner({
  lembrete,
  onConcluir,
  onAdiar,
}: NotificationActionBannerProps) {
  if (!lembrete) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.header}>
        <Text style={styles.appLabel}>⏰ Hábitos • agora</Text>
      </View>
      <Text style={styles.title}>{lembrete.titulo}</Text>
      {!!lembrete.descricao && (
        <Text style={styles.body}>{lembrete.descricao}</Text>
      )}
      <View style={styles.actions}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => onConcluir(lembrete.notificationId)}
        >
          <Text style={styles.actionBtnText}>Concluir</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => onAdiar(lembrete.titulo, lembrete.descricao)}
        >
          <Text style={styles.actionBtnText}>Adiar 10 min</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  actionBtnText: {
    color: colors.accentBlue,
    fontWeight: '600',
    fontSize: 13,
  },
});
